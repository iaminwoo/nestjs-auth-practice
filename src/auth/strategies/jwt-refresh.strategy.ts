import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { JwtPayload, RefreshUser } from 'src/common/types';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: (request: Request) =>
        (request?.cookies?.['refresh_token'] as string) || null,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): RefreshUser {
    const refreshToken = (req.cookies?.['refresh_token'] as string) || null;
    if (!refreshToken) throw new UnauthorizedException();

    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      refreshToken: refreshToken,
    };
  }
}
