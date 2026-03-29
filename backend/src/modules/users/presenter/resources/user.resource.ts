import { Injectable } from '@nestjs/common';
import { User } from 'src/common/entities';

@Injectable()
export class UserResource {
  convert(user: User) {
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName || null,
      last_name: user.lastName || null,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt || null,
    };
  }
}
