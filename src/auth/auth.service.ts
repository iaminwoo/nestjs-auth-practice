import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Role } from 'src/common/enum';
import { AuthUser } from 'src/common/types';
import { UsersService } from 'src/users/users.service';

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
    const payload = { username: user.username, sub: user.id, role: user.role };
    const jwtToken = await this.jwtService.signAsync(payload);
    res.cookie('access_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return {
      access_token: jwtToken,
    };
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
