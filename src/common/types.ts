import { Request } from 'express';
import { Role } from 'src/common/enum';

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user: AuthUser;
}

export interface JwtPayload {
  sub: number;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}
