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
import { AuthUser } from './dto/auth-user.type';
import { KnowledgeLevel } from './dto/knowledge-level.enum';
import { OAuthProvider } from './dto/oauth-provider.enum';
import { PreferredLocale } from './dto/preferred-locale.enum';
import { RegisterInput } from './dto/register.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { hashPassword, verifyPassword } from './lib/password';
import { JwtPayload } from './types/jwt-payload.type';
import { OAuthAccountsRepository } from '../database/repositories/oauth-accounts.repository';
import {
  hashRefreshToken,
  RefreshSessionsRepository,
} from '../database/repositories/refresh-sessions.repository';
import { UsersRepository } from '../database/repositories/users.repository';

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

export interface AuthSessionResult {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly jwtSecrets: JwtSecrets;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly oauthAccountsRepository: OAuthAccountsRepository,
    private readonly refreshSessionsRepository: RefreshSessionsRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecrets = resolveJwtSecrets(configService);
  }

  async login(email: string, password: string): Promise<AuthSessionResult> {
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

  async register(input: RegisterInput): Promise<AuthSessionResult> {
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

  async refreshWithOpaqueToken(refreshToken: string | undefined): Promise<AuthSessionResult> {
    if (!refreshToken?.trim()) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const tokenHash = hashRefreshToken(refreshToken.trim());
    const session = await this.refreshSessionsRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.revokedAt) {
      await this.refreshSessionsRepository.revokeFamily(session.familyId);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.refreshSessionsRepository.revokeSession(session.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.usersRepository.findById(session.userId);
    if (!user?.email) {
      await this.refreshSessionsRepository.revokeFamily(session.familyId);
      throw new UnauthorizedException('User not found');
    }

    await this.refreshSessionsRepository.revokeSession(session.id);
    return this.issueTokens(user.id, user.email, session.familyId);
  }

  async revokeOpaqueRefreshToken(refreshToken: string | undefined, userId: string): Promise<void> {
    if (!refreshToken?.trim()) {
      return;
    }

    const tokenHash = hashRefreshToken(refreshToken.trim());
    const session = await this.refreshSessionsRepository.findByTokenHash(tokenHash);

    if (!session || session.userId !== userId) {
      return;
    }

    await this.refreshSessionsRepository.revokeSession(session.id);
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.usersRepository.findById(userId);

    if (!user?.email) {
      throw new NotFoundException('User not found');
    }

    const oauthAccounts = await this.oauthAccountsRepository.findByUserId(userId);

    return this.toAuthUser(
      user,
      oauthAccounts.map((account) => account.provider as OAuthProvider),
    );
  }

  async issueTokensForUser(userId: string, email: string): Promise<AuthSessionResult> {
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

    return this.toAuthUser(updated, await this.loadOAuthProviders(userId));
  }

  async unlinkOAuthProvider(userId: string, provider: OAuthProvider): Promise<AuthUser> {
    const user = await this.usersRepository.findById(userId);

    if (!user?.email) {
      throw new NotFoundException('User not found');
    }

    const linkedAccounts = await this.oauthAccountsRepository.findByUserId(userId);
    const targetAccount = linkedAccounts.find((account) => account.provider === provider);

    if (!targetAccount) {
      throw new BadRequestException('OAuth provider is not linked');
    }

    const hasPassword = Boolean(user.passwordHash);
    const remainingOAuthCount = linkedAccounts.filter(
      (account) => account.provider !== provider,
    ).length;

    if (!hasPassword && remainingOAuthCount === 0) {
      throw new BadRequestException('Cannot unlink the only sign-in method');
    }

    await this.oauthAccountsRepository.deleteByUserAndProvider(userId, provider);

    return this.toAuthUser(user, await this.loadOAuthProviders(userId));
  }

  private async loadOAuthProviders(userId: string): Promise<OAuthProvider[]> {
    const accounts = await this.oauthAccountsRepository.findByUserId(userId);
    return accounts.map((account) => account.provider as OAuthProvider);
  }

  private toAuthUser(
    user: typeof users.$inferSelect,
    oauthProviders: OAuthProvider[] = [],
  ): AuthUser {
    return {
      userId: user.id,
      email: user.email!,
      name: user.name,
      knowledgeLevel: user.knowledgeLevel as KnowledgeLevel,
      preferredLocale: user.preferredLocale as PreferredLocale,
      oauthProviders,
    };
  }

  private async issueTokens(
    userId: string,
    email: string,
    familyId?: string,
  ): Promise<AuthSessionResult> {
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      tokenType: 'access',
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiresInSeconds,
    });

    const expiresAt = new Date(Date.now() + this.refreshExpiresInSeconds * 1000);
    const { rawToken } = await this.refreshSessionsRepository.createSession(
      userId,
      expiresAt,
      familyId,
    );

    return { accessToken, refreshToken: rawToken };
  }

  private get accessSecret(): string {
    return this.jwtSecrets.accessSecret;
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
