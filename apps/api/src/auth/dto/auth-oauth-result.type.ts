export class AuthOAuthResult {
  accessToken!: string;
  isNewUser!: boolean;
}

/** Internal OAuth session payload before refresh cookie is set. */
export interface AuthOAuthSession {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}
