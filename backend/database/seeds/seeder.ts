import { Injectable } from '@nestjs/common';
import { ApplicationsSeeder } from './modules/applications/applications.seeder';
import { UsersSeeder } from './modules/users/users.seeder';

@Injectable()
export class Seeder {
  constructor(
    private readonly usersSeeder: UsersSeeder,
    private readonly applicationsSeeder: ApplicationsSeeder,
  ) {}

  async seed() {
    await this.usersSeeder.run();
    await this.applicationsSeeder.run();
  }
}
