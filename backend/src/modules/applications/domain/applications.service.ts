import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorCode } from '../../../common/constants';
import { Application } from '../../../common/entities';
import { buildHttpError } from '../../../common/helpers';
import { ApplicationsRepository } from '../data';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto';

interface GetApplicationsPayload {
  page?: number;
  limit?: number;
  status?: string;
}

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
  ) {}

  async getApplications(payload: GetApplicationsPayload) {
    const page = payload.page || 1;
    const limit = payload.limit || 20;

    const [applications, total] =
      await this.applicationsRepository.getApplicationsWithPagination({
        page,
        limit,
        status: payload.status,
      });

    return {
      applications,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async getOneApplicationById(applicationId: string): Promise<Application> {
    const application =
      await this.applicationsRepository.getOneById(applicationId);

    if (!application) {
      throw buildHttpError(ErrorCode.NotFound, HttpStatus.NOT_FOUND);
    }

    return application;
  }

  createApplication(payload: CreateApplicationDto): Promise<Application> {
    return this.applicationsRepository.createAndGetApplication(payload);
  }

  async updateApplication(payload: UpdateApplicationDto): Promise<Application> {
    if (
      payload.title === undefined &&
      payload.description === undefined &&
      payload.status === undefined
    ) {
      throw buildHttpError(ErrorCode.ValidationFailed, HttpStatus.BAD_REQUEST, {
        message: 'At least one field should be provided for update',
      });
    }

    const application =
      await this.applicationsRepository.updateAndGetApplication(payload);

    if (!application) {
      throw buildHttpError(ErrorCode.NotFound, HttpStatus.NOT_FOUND);
    }

    return application;
  }
}
