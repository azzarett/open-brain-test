import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserDao } from 'src/common/dao';
import { users } from './users.mock';

@Injectable()
export class UsersSeeder {
  constructor(
    @InjectRepository(UserDao)
    private readonly usersRepository: Repository<UserDao>,
  ) {}

  async run() {
    const preparedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hash(user.password, 10),
      })),
    );

    await this.usersRepository.insert(preparedUsers);
  }
}
