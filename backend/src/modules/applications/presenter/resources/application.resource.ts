import { Injectable } from '@nestjs/common';
import { Application } from 'src/common/entities';

@Injectable()
export class ApplicationResource {
  convert(application: Application) {
    return {
      id: application.id,
      title: application.title,
      description: application.description,
      status: application.status,
      created_at: application.createdAt,
      updated_at: application.updatedAt,
      deleted_at: application.deletedAt || null,
    };
  }
}
