import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class SocialsDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  github?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  twitter?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  linkedin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  mastodon?: string;
}

export class UpdatePersonalDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  heading?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  sub_heading?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  information?: string;

  @IsOptional()
  @IsString()
  interests?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  availability?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  now_doing?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialsDto)
  socials?: SocialsDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  stack?: string[];
}
