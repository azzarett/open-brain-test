import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationDao } from 'src/common/dao';
import { ApplicationsRepository } from './data';
import { ApplicationsService } from './domain/applications.service';
import { ApplicationsController } from './presenter/applications.controller';
import { ApplicationResource } from './presenter/resources/application.resource';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationDao])],
  controllers: [ApplicationsController],
  providers: [ApplicationsRepository, ApplicationsService, ApplicationResource],
  exports: [ApplicationsRepository, ApplicationsService],
})
export class ApplicationsModule {}
