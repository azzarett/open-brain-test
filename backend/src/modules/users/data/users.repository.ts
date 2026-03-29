import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDao } from 'src/common/dao';
import { User } from 'src/common/entities';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserDao)
    private readonly usersRepository: Repository<UserDao>,
  ) {}

  getOneUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  getOneUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }
}
