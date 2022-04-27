export interface ICookieOptions {
  expires: Date;
  httpOnly: boolean;
  path: string;

  secure?: boolean;
  domain?: string;
  sameSite?: boolean | 'lax' | 'strict' | 'none' | undefined;
}
