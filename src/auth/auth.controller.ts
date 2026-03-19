import {
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { Public, Roles } from 'src/common/decorator';
import { Role } from 'src/common/enum';
import type { RequestWithUser } from 'src/common/types';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user, res);
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Patch('admin')
  makeAdmin(
    @Request() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.makeAdmin(req.user.username, res);
  }

  @Get('only-admin')
  @Roles(Role.Admin)
  onlyAdmin() {
    return 'Only Admin';
  }
}
