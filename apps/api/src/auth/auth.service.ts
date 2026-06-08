import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { assertLoginInput, assertRegisterInput, assertUpdateProfileName } from '@repo/api';

import {
  resolveJwtExpiresInSeconds,
  resolveJwtSecrets,
  type JwtSecrets,
} from '../config/jwt.config';
import { users } from '../database';
import { AuthTokens } from './dto/auth-tokens.type';
import { AuthUser } from './dto/auth-user.type';
import { KnowledgeLevel } from './dto/knowledge-level.enum';
import { PreferredLocale } from './dto/preferred-locale.enum';
import { RegisterInput } from './dto/register.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { hashPassword, verifyPassword } from './lib/password';
import { JwtPayload } from './types/jwt-payload.type';
import { UsersRepository } from '../database/repositories/users.repository';

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly jwtSecrets: JwtSecrets;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecrets = resolveJwtSecrets(configService);
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const { email: normalizedEmail, password: validPassword } = this.validateLogin(email, password);

    const user = await this.usersRepository.findByEmail(normalizedEmail);

    if (!user?.passwordHash || !user.email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await verifyPassword(validPassword, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user.id, user.email);
  }

  async register(input: RegisterInput): Promise<AuthTokens> {
    const { email: normalizedEmail, password, name } = this.validateRegister(input);

    const existingUser = await this.usersRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await hashPassword(password);

    const [createdUser] = await this.usersRepository.create({
      email: normalizedEmail,
      name,
      passwordHash,
    });

    if (!createdUser?.email) {
      throw new UnauthorizedException('Unable to create user');
    }

    return this.issueTokens(createdUser.id, createdUser.email);
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken?.trim()) {
      throw new BadRequestException('Refresh token is required');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken.trim(), {
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
    const user = await this.usersRepository.findById(userId);

    if (!user?.email) {
      throw new NotFoundException('User not found');
    }

    return this.toAuthUser(user);
  }

  async issueTokensForUser(userId: string, email: string): Promise<AuthTokens> {
    return this.issueTokens(userId, email);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<AuthUser> {
    const updates: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (input.name !== undefined) {
      updates.name = this.validateProfileName(input.name);
    }
    if (input.knowledgeLevel !== undefined) {
      updates.knowledgeLevel = input.knowledgeLevel;
    }
    if (input.preferredLocale !== undefined) {
      updates.preferredLocale = input.preferredLocale;
    }

    const [updated] = await this.usersRepository.update(userId, updates);

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
    return this.jwtSecrets.accessSecret;
  }

  private get refreshSecret(): string {
    return this.jwtSecrets.refreshSecret;
  }

  private get accessExpiresInSeconds(): number {
    return resolveJwtExpiresInSeconds(this.configService, 'JWT_EXPIRES_IN_SECONDS', 900);
  }

  private get refreshExpiresInSeconds(): number {
    return resolveJwtExpiresInSeconds(this.configService, 'JWT_REFRESH_EXPIRES_IN_SECONDS', 604800);
  }

  private validateLogin(email: string, password: string) {
    try {
      return assertLoginInput({ email, password });
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Invalid login input');
    }
  }

  private validateRegister(input: RegisterInput) {
    try {
      return assertRegisterInput(input);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid registration input',
      );
    }
  }

  private validateProfileName(name: string | null | undefined): string | null {
    try {
      return assertUpdateProfileName(name);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid profile input',
      );
    }
  }
}
