import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PersonalService } from './personal.service';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { ipFingerprint } from 'src/common/utils/ip-fingerprint';

@Controller('personal')
export class PersonalController {
  constructor(private readonly service: PersonalService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async get(@Req() req: Request & { user?: unknown }) {
    const personal = await this.service.getPersonal();
    void this.service
      .maybeIncrementViews(personal.id, ipFingerprint(req), Boolean(req.user))
      .catch(() => undefined);
    return { success: true, personal };
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@Body() dto: UpdatePersonalDto) {
    const personal = await this.service.getPersonal();
    const updated = await this.service.update(personal.id, dto);
    return { success: true, personal: updated };
  }
}
