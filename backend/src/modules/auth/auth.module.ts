import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessTokenDao } from 'src/common/dao';
import { UsersModule } from '../users/users.module';
import { UserAccessTokensRepository } from './data';
import { AuthService } from './domain/auth.service';
import { AuthController } from './presenter/auth.controller';
import { AuthResource } from './presenter/resources';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccessTokenDao]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserAccessTokensRepository,
    JwtAccessStrategy,
    AuthResource,
  ],
  exports: [UserAccessTokensRepository],
})
export class AuthModule {}
