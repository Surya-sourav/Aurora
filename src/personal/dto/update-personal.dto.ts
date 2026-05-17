import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

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
}
