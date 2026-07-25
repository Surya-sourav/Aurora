import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MaxLength(255)
  heading: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subheading?: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  signature?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_o, v) => v !== null && v !== undefined)
  @IsUUID()
  category_id?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_o, v) => v !== null && v !== undefined)
  @IsUUID()
  series_id?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  series_order?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_o, v) => v !== null && v !== undefined)
  @IsString()
  scheduled_publish_at?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  mastodon_post_url?: string;
}
