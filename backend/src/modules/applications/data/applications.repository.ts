import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { IsNull, Repository } from 'typeorm';
import { ApplicationDao } from '../../../common/dao';
import { Application } from '../../../common/entities';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto';

interface GetApplicationsOptions {
  page: number;
  limit: number;
  status?: string;
}

@Injectable()
export class ApplicationsRepository {
  constructor(
    @InjectRepository(ApplicationDao)
    private readonly applicationsRepository: Repository<ApplicationDao>,
  ) {}

  async getApplicationsWithPagination(
    options: GetApplicationsOptions,
  ): Promise<[Application[], number]> {
    const where = {
      deletedAt: IsNull(),
      ...(options.status ? { status: options.status } : {}),
    };

    return this.applicationsRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });
  }

  getOneById(id: string): Promise<Application | null> {
    return this.applicationsRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
  }

  async createAndGetApplication(
    payload: CreateApplicationDto,
  ): Promise<Application> {
    const id = v4();

    await this.applicationsRepository.insert({
      id,
      title: payload.title,
      description: payload.description,
      status: payload.status || 'new',
    });

    return this.applicationsRepository.findOneByOrFail({ id });
  }

  async updateAndGetApplication(
    payload: UpdateApplicationDto,
  ): Promise<Application | null> {
    await this.applicationsRepository.update(
      {
        id: payload.id,
        deletedAt: IsNull(),
      },
      {
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.description !== undefined
          ? { description: payload.description }
          : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
      },
    );

    return this.getOneById(payload.id);
  }
}
