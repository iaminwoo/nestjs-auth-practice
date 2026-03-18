import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../common/enum';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(username: string, password: string) {
    const newUser = this.userRepository.create({
      username,
      password: await bcrypt.hash(password, await bcrypt.genSalt()),
    });
    return await this.userRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username });
  }

  async findUserWithUsername(username: string): Promise<User> {
    const user = await this.findOne(username);
    if (!user) throw new NotFoundException();
    return user;
  }

  async changeRole(username: string, newRole: Role): Promise<User> {
    const user = await this.findUserWithUsername(username);
    user.role = newRole;
    return await this.userRepository.save(user);
  }
}
