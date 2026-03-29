import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const APPLICATION_STATUSES = ['new', 'in_review', 'approved', 'rejected'];

export class GetApplicationsQuery {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  @IsIn(APPLICATION_STATUSES)
  status?: string;
}
