import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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

  async login(user: AuthUser): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async makeAdmin(username: string): Promise<{ access_token: string }> {
    const user = await this.userService.changeRole(username, Role.Admin);
    return await this.login({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  }
}
