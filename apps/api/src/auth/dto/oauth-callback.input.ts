import { ApiProperty } from '@nestjs/swagger';

export class OAuthCallbackInput {
  @ApiProperty({ description: 'OAuth authorization code from provider callback' })
  code!: string;

  @ApiProperty({ description: 'Redirect URI used in the OAuth authorization request' })
  redirectUri!: string;
}
