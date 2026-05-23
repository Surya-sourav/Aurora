import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from 'src/database/entities/admin-user.entity';
import { Personal } from 'src/database/entities/personal.entity';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    @InjectRepository(AdminUser) private readonly adminRepo: Repository<AdminUser>,
    @InjectRepository(Personal) private readonly personalRepo: Repository<Personal>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedPersonal();
    await this.seedAdmin();
  }

  private async seedPersonal() {
    const existing = await this.personalRepo.findOne({ where: {} });
    if (existing) return;

    const name = process.env.ADMIN_NAME ?? 'Anonymous';
    const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
    const created = this.personalRepo.create({
      name,
      email,
      heading: 'building reliable systems & writing about them',
      sub_heading: 'software engineer',
      location: '',
      availability: 'open to collaboration',
      now_doing: 'Working on Aurora — this site.',
      socials: {},
      stack: [],
      content:
        "## $ whoami\n\nWelcome to my corner of the internet. I write about systems, code, and the things I learn along the way.\n\n```bash\n> uptime\nrunning since 2019 · still curious\n```",
      information:
        '## elsewhere\n\n- GitHub: [@your-handle](https://github.com/your-handle)\n- Email: ' +
        email,
      interests:
        '## things i think about\n\n- distributed systems & databases\n- programming language design\n- developer tools that respect your time\n- the unreasonable effectiveness of plain text',
    });
    await this.personalRepo.save(created);
    this.logger.log(`Seeded Personal singleton (${created.id})`);
  }

  private async seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!email || !passwordHash) {
      this.logger.warn(
        'ADMIN_EMAIL or ADMIN_PASSWORD_HASH missing — skipping admin seed. Generate the hash with: node -e "console.log(require(\'bcrypt\').hashSync(\'your-password\', 12))"',
      );
      return;
    }
    const existing = await this.adminRepo.findOne({ where: { email } });
    if (existing) return;
    const created = this.adminRepo.create({ email, password_hash: passwordHash });
    await this.adminRepo.save(created);
    this.logger.log(`Seeded AdminUser ${email}`);
  }
}
