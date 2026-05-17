import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreatePersonalImageMetaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt_text?: string;
}

export class UpdatePersonalImageDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt_text?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}
