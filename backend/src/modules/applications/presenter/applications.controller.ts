import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationsService } from '../domain/applications.service';
import { CreateApplicationBody } from './bodies/create-application.body';
import { UpdateApplicationBody } from './bodies/update-application.body';
import { GetApplicationIdParams } from './params/get-application-id.params';
import { GetApplicationsQuery } from './queries/get-applications.query';
import { ApplicationResource } from './resources/application.resource';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/v1/applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly applicationResource: ApplicationResource,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get applications list' })
  @ApiResponse({ status: 200, description: 'Applications list was fetched' })
  async getApplications(@Query() query: GetApplicationsQuery) {
    const result = await this.applicationsService.getApplications({
      page: query.page,
      limit: query.limit,
      status: query.status,
    });

    return {
      data: result.applications.map((application) =>
        this.applicationResource.convert(application),
      ),
      meta: result.meta,
    };
  }

  @Get('/:application_id')
  @ApiOperation({ summary: 'Get one application by id' })
  @ApiResponse({ status: 200, description: 'Application was fetched' })
  @ApiResponse({ status: 404, description: 'Application was not found' })
  async getOneById(@Param() params: GetApplicationIdParams) {
    const application = await this.applicationsService.getOneApplicationById(
      params.application_id,
    );

    return {
      data: this.applicationResource.convert(application),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create application' })
  @ApiBody({ type: CreateApplicationBody })
  @ApiResponse({ status: 201, description: 'Application was created' })
  async createApplication(@Body() body: CreateApplicationBody) {
    const application = await this.applicationsService.createApplication({
      title: body.title,
      description: body.description,
      status: body.status,
    });

    return {
      data: this.applicationResource.convert(application),
    };
  }

  @Patch('/:application_id')
  @ApiOperation({ summary: 'Update application' })
  @ApiBody({ type: UpdateApplicationBody })
  @ApiResponse({ status: 200, description: 'Application was updated' })
  @ApiResponse({ status: 404, description: 'Application was not found' })
  async updateApplication(
    @Param() params: GetApplicationIdParams,
    @Body() body: UpdateApplicationBody,
  ) {
    const application = await this.applicationsService.updateApplication({
      id: params.application_id,
      title: body.title,
      description: body.description,
      status: body.status,
    });

    return {
      data: this.applicationResource.convert(application),
    };
  }
}
