import { Injectable } from '@nestjs/common';
import { Auth } from 'src/common/entities';

@Injectable()
export class AuthResource {
  convert(auth: Auth) {
    return {
      access: {
        token: auth.access.token,
      },
    };
  }
}
