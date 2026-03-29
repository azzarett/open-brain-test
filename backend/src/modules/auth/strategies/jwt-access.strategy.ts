import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ErrorCode } from 'src/common/constants';
import { getAuthConfig } from 'src/config/auth.config';
import { UsersRepository } from 'src/modules/users/data';
import { UserAccessTokensRepository } from '../data';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userAccessTokensRepository: UserAccessTokensRepository,
    private readonly usersRepository: UsersRepository,
  ) {
    const authConfig = getAuthConfig();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.access.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { sub: string }) {
    const token = request.get('Authorization')?.replace('Bearer', '').trim();

    if (!token) {
      throw new UnauthorizedException({
        error_code: ErrorCode.Unauthorized,
        message: 'Authorization token is missing',
      });
    }

    const userAccessToken =
      await this.userAccessTokensRepository.getOneByToken(token);

    if (!userAccessToken) {
      throw new UnauthorizedException({
        error_code: ErrorCode.Unauthorized,
        message: 'Authorization token is invalid',
      });
    }

    const user = await this.usersRepository.getOneUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException({
        error_code: ErrorCode.Unauthorized,
        message: 'User from token is not found',
      });
    }

    return user;
  }
}
