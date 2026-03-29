import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Auth, User } from 'src/common/entities';
import { ErrorCode } from 'src/common/constants';
import { buildHttpError } from 'src/common/helpers';
import { getAuthConfig } from 'src/config/auth.config';
import { UsersRepository } from 'src/modules/users/data';
import { GetTokensDto } from '../dto';
import { UserAccessTokensRepository } from '../data';

@Injectable()
export class AuthService {
  private readonly authConfig = getAuthConfig();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly userAccessTokensRepository: UserAccessTokensRepository,
  ) {}

  async getTokens(payload: GetTokensDto): Promise<[User, Auth]> {
    const user = await this.usersRepository.getOneUserByEmail(payload.email);

    if (!user) {
      throw buildHttpError(
        ErrorCode.CredentialsAreInvalid,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw buildHttpError(
        ErrorCode.CredentialsAreInvalid,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessToken = await this.getAccessToken(user.id);

    await this.userAccessTokensRepository.insertAndGetUserAccessToken({
      userId: user.id,
      token: accessToken,
    });

    return [
      user,
      {
        access: {
          token: accessToken,
        },
      },
    ];
  }

  async softDeleteAccessToken(token: string): Promise<void> {
    if (!token) {
      throw buildHttpError(
        ErrorCode.AccessTokenNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingToken =
      await this.userAccessTokensRepository.getOneByToken(token);

    if (!existingToken) {
      throw buildHttpError(ErrorCode.AccessTokenNotFound, HttpStatus.NOT_FOUND);
    }

    await this.userAccessTokensRepository.softDeleteAccessToken(token);
  }

  private async getAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        secret: this.authConfig.jwt.access.secret,
        expiresIn: this.authConfig.jwt.access.expiresIn as any,
      },
    );
  }
}
