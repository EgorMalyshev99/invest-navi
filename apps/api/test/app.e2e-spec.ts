import { randomUUID } from 'crypto';

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { DRIZZLE } from '../src/database';

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  const usersStore = new Map<
    string,
    {
      id: string;
      email: string | null;
      name: string | null;
      passwordHash: string | null;
      avatarUrl: string | null;
      createdAt: Date;
      updatedAt: Date;
    }
  >();

  const fakeDb = {
    query: {
      users: {
        findFirst: async () => {
          return usersStore.values().next().value;
        },
      },
    },
    insert: () => ({
      values: (input: { email: string; name: string | null; passwordHash: string }) => ({
        returning: async () => {
          const user = {
            id: randomUUID(),
            email: input.email,
            name: input.name,
            passwordHash: input.passwordHash,
            avatarUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          usersStore.set(user.id, user);
          return [{ id: user.id, email: user.email }];
        },
      }),
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DRIZZLE)
      .useValue(fakeDb)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterAll(async () => {
    await app.close();
  });

  it('should bootstrap the application', async () => {
    expect(app).toBeDefined();
    expect(app.getHttpServer()).toBeDefined();
    expect(usersStore.size).toBe(0);
  });

  it('should register, login, refresh tokens and get me', async () => {
    const registerMutation = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          accessToken
          refreshToken
        }
      }
    `;

    const registerResponse = await request(httpServer)
      .post('/graphql')
      .send({
        query: registerMutation,
        variables: {
          input: {
            email: 'user@example.com',
            password: 'pass123',
            name: 'Test User',
          },
        },
      })
      .expect(200);

    expect(registerResponse.body.errors).toBeUndefined();
    expect(registerResponse.body.data.register.accessToken).toEqual(expect.any(String));
    expect(registerResponse.body.data.register.refreshToken).toEqual(expect.any(String));

    const loginMutation = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          accessToken
          refreshToken
        }
      }
    `;

    const loginResponse = await request(httpServer)
      .post('/graphql')
      .send({
        query: loginMutation,
        variables: {
          input: {
            email: 'user@example.com',
            password: 'pass123',
          },
        },
      })
      .expect(200);

    expect(loginResponse.body.errors).toBeUndefined();
    expect(loginResponse.body.data.login.accessToken).toEqual(expect.any(String));
    expect(loginResponse.body.data.login.refreshToken).toEqual(expect.any(String));

    const meQuery = `
      query Me {
        me {
          userId
          email
        }
      }
    `;

    const meResponse = await request(httpServer)
      .post('/graphql')
      .set('Authorization', `Bearer ${loginResponse.body.data.login.accessToken}`)
      .send({ query: meQuery })
      .expect(200);

    expect(meResponse.body.errors).toBeUndefined();
    expect(meResponse.body.data.me.email).toBe('user@example.com');
    expect(meResponse.body.data.me.userId).toEqual(expect.any(String));

    const refreshMutation = `
      mutation Refresh($token: String!) {
        refreshTokens(refreshToken: $token) {
          accessToken
          refreshToken
        }
      }
    `;

    const refreshResponse = await request(httpServer)
      .post('/graphql')
      .send({
        query: refreshMutation,
        variables: {
          token: loginResponse.body.data.login.refreshToken,
        },
      })
      .expect(200);

    expect(refreshResponse.body.errors).toBeUndefined();
    expect(refreshResponse.body.data.refreshTokens.accessToken).toEqual(expect.any(String));
    expect(refreshResponse.body.data.refreshTokens.refreshToken).toEqual(expect.any(String));
  });

  it('should reject login with invalid password', async () => {
    const loginMutation = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          accessToken
          refreshToken
        }
      }
    `;

    const response = await request(httpServer)
      .post('/graphql')
      .send({
        query: loginMutation,
        variables: {
          input: {
            email: 'user@example.com',
            password: 'wrong-password',
          },
        },
      })
      .expect(200);

    expect(response.body.data).toBeNull();
    expect(response.body.errors?.[0]?.message).toContain('Invalid credentials');
  });

  it('should reject refresh with invalid token', async () => {
    const refreshMutation = `
      mutation Refresh($token: String!) {
        refreshTokens(refreshToken: $token) {
          accessToken
          refreshToken
        }
      }
    `;

    const response = await request(httpServer)
      .post('/graphql')
      .send({
        query: refreshMutation,
        variables: {
          token: 'not-a-valid-token',
        },
      })
      .expect(200);

    expect(response.body.data).toBeNull();
    expect(response.body.errors?.[0]?.message).toContain('Invalid refresh token');
  });
});
