import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  root() {
    return { ok: true, service: 'aurora-backend' };
  }

  @Get('health')
  health() {
    return { ok: true };
  }
}
