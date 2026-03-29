import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDao } from 'src/common/dao';
import { UsersRepository } from './data';
import { UserResource } from './presenter/resources';

@Module({
  imports: [TypeOrmModule.forFeature([UserDao])],
  providers: [UsersRepository, UserResource],
  exports: [UsersRepository, UserResource],
})
export class UsersModule {}
