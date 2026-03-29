import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const APPLICATION_STATUSES = ['new', 'in_review', 'approved', 'rejected'];

export class UpdateApplicationBody {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(APPLICATION_STATUSES)
  status?: string;
}
