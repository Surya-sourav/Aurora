import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AiService } from './ai.service';

class SuggestTagsDto {
  @IsString()
  @MaxLength(50000)
  body: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  heading?: string;
}

@Controller('ai')
export class AiController {
  constructor(private readonly service: AiService) {}

  @Post('suggest-tags')
  @UseGuards(JwtAuthGuard)
  async suggestTags(@Body() dto: SuggestTagsDto) {
    if (!this.service.enabled) {
      throw new HttpException(
        {
          success: false,
          message:
            'AI features not configured — set ANTHROPIC_API_KEY in .env to enable',
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    const tags = await this.service.suggestTags(dto.heading ?? '', dto.body);
    return { success: true, tags };
  }
}
