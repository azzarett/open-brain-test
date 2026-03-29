import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetApplicationIdParams {
  @IsNotEmpty()
  @IsUUID()
  application_id: string;
}
