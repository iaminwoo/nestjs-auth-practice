import {
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { RequestWithUser } from 'src/common/types';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public, Roles } from 'src/common/decorator';
import { Role } from 'src/common/enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Patch('admin')
  makeAdmin(@Request() req: RequestWithUser) {
    return this.authService.makeAdmin(req.user.username);
  }

  @Get('only-admin')
  @Roles(Role.Admin)
  onlyAdmin() {
    return 'Only Admin';
  }
}
