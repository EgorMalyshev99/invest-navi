import { isPasswordAcceptableForRegistration } from '@repo/api';
import {
  BadRequestException,
  Inject,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB, users } from '../database';
import { AuthTokens } from './dto/auth-tokens.type';
import { AuthUser } from './dto/auth-user.type';
import { KnowledgeLevel } from './dto/knowledge-level.enum';
import { PreferredLocale } from './dto/preferred-locale.enum';
import { RegisterInput } from './dto/register.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { hashPassword, verifyPassword } from './lib/password';
import { JwtPayload } from './types/jwt-payload.type';

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthTokens> {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (!user?.passwordHash || !user.email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user.id, user.email);
  }

  async register(input: RegisterInput): Promise<AuthTokens> {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (!isPasswordAcceptableForRegistration(input.password)) {
      throw new BadRequestException(
        'Password is too weak. Use at least 8 characters with upper and lower case letters and a digit.',
      );
    }

    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);

    const [createdUser] = await this.db
      .insert(users)
      .values({
        email: normalizedEmail,
        name: input.name?.trim() || null,
        passwordHash,
      })
      .returning({
        id: users.id,
        email: users.email,
      });

    if (!createdUser?.email) {
      throw new UnauthorizedException('Unable to create user');
    }

    return this.issueTokens(createdUser.id, createdUser.email);
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.tokenType !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    return this.issueTokens(payload.sub, payload.email);
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user?.email) {
      throw new NotFoundException('User not found');
    }

    return this.toAuthUser(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<AuthUser> {
    const updates: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (input.name !== undefined) {
      updates.name = input.name.trim() || null;
    }
    if (input.knowledgeLevel !== undefined) {
      updates.knowledgeLevel = input.knowledgeLevel;
    }
    if (input.preferredLocale !== undefined) {
      updates.preferredLocale = input.preferredLocale;
    }

    const [updated] = await this.db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    if (!updated?.email) {
      throw new NotFoundException('User not found');
    }

    return this.toAuthUser(updated);
  }

  private toAuthUser(user: typeof users.$inferSelect): AuthUser {
    return {
      userId: user.id,
      email: user.email!,
      name: user.name,
      knowledgeLevel: user.knowledgeLevel as KnowledgeLevel,
      preferredLocale: user.preferredLocale as PreferredLocale,
    };
  }

  private async issueTokens(userId: string, email: string): Promise<AuthTokens> {
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      tokenType: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: userId,
      email,
      tokenType: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresInSeconds,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresInSeconds,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private get accessSecret(): string {
    return this.configService.get<string>('JWT_SECRET') ?? 'dev-access-secret';
  }

  private get refreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
  }

  private get accessExpiresInSeconds(): number {
    return this.configService.get<number>('JWT_EXPIRES_IN_SECONDS') ?? 900;
  }

  private get refreshExpiresInSeconds(): number {
    return this.configService.get<number>('JWT_REFRESH_EXPIRES_IN_SECONDS') ?? 604800;
  }
}
