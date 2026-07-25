import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @MaxLength(160)
  company_name: string;

  @IsString()
  @MaxLength(200)
  job_title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  company_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  employment_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsDateString()
  start_date: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_o, v) => v !== null && v !== undefined)
  @IsDateString()
  end_date?: string | null;
}
