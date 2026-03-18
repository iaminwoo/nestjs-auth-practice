import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  signup(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto.username, createDto.password);
  }
}
