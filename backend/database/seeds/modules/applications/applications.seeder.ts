import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationDao } from 'src/common/dao';
import { applications } from './applications.mock';

@Injectable()
export class ApplicationsSeeder {
  constructor(
    @InjectRepository(ApplicationDao)
    private readonly applicationsRepository: Repository<ApplicationDao>,
  ) {}

  async run() {
    await this.applicationsRepository.insert(applications);
  }
}