import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Role } from 'src/common/enum';
import { AuthUser } from 'src/common/types';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<AuthUser> {
    const user = await this.userService.findUserWithUsername(username);
    if (await bcrypt.compare(pass, user.password)) {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    }
    throw new UnauthorizedException();
  }

  async login(
    user: AuthUser,
    res: Response,
  ): Promise<{ access_token: string }> {
    // access token
    const payload = { username: user.username, sub: user.id, role: user.role };
    const jwtToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1m',
    });

    res.cookie('access_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // refresh token
    const refreshToken = await this.jwtService.signAsync(
      {
        username: user.username,
        sub: user.id,
        role: user.role,
      },
      {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
      },
    );
    await this.userService.setRefreshToken(refreshToken, user.username);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      access_token: jwtToken,
    };
  }

  async refreshAccessToken(
    username: string,
    refreshToken: string,
    res: Response,
  ) {
    const user = await this.userService.findUserWithUsername(username);
    if (!user.refreshToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!match) throw new UnauthorizedException();

    return await this.login(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      res,
    );
  }

  async makeAdmin(
    username: string,
    res: Response,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.changeRole(username, Role.Admin);
    return await this.login(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      res,
    );
  }
}
