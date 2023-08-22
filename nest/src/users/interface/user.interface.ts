export interface OAuthUser {
  providerId: string;
  email: string;
  name: string;
  provider: string;
}

export interface JwtUser {
  id: string;
  intraId: string;
}
