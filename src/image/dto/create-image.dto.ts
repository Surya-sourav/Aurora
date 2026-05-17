import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateImageMetaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt_text?: string;

  @IsOptional()
  @IsUUID()
  blog_id?: string;
}
