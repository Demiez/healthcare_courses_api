export class JwtPayloadDataModel {
  public userId: string;
  public iat?: number;
  public exp?: number;

  constructor(userId: string) {
    this.userId = userId;
  }
}
