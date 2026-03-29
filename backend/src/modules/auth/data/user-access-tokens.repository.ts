import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { IsNull, Repository } from 'typeorm';
import { UserAccessTokenDao } from 'src/common/dao';

interface CreateUserAccessTokenPayload {
  userId: string;
  token: string;
}

@Injectable()
export class UserAccessTokensRepository {
  constructor(
    @InjectRepository(UserAccessTokenDao)
    private readonly userAccessTokensRepository: Repository<UserAccessTokenDao>,
  ) {}

  async insertAndGetUserAccessToken(payload: CreateUserAccessTokenPayload) {
    const id = v4();

    await this.userAccessTokensRepository.insert({
      id,
      userId: payload.userId,
      token: payload.token,
    });

    return this.userAccessTokensRepository.findOne({
      where: {
        id,
      },
    });
  }

  getOneByToken(token: string): Promise<UserAccessTokenDao | null> {
    return this.userAccessTokensRepository.findOne({
      where: {
        token,
        deletedAt: IsNull(),
      },
    });
  }

  async softDeleteAccessToken(token: string): Promise<void> {
    await this.userAccessTokensRepository.update(
      {
        token,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date().toISOString(),
      },
    );
  }

  async softDeleteAccessTokens(userId: string): Promise<void> {
    await this.userAccessTokensRepository.update(
      {
        userId,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date().toISOString(),
      },
    );
  }
}
