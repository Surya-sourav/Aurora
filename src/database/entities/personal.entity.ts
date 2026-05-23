import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { PersonalImage } from './personal-image.entity';

@Entity('personal')
export class Personal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  heading: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  sub_heading: string;

  @Column({ type: 'text', default: '' })
  content: string;

  @Column({ type: 'text', default: '' })
  information: string;

  @Column({ type: 'text', default: '' })
  interests: string;

  @Column({ type: 'varchar', length: 120, default: '' })
  location: string;

  @Column({ type: 'varchar', length: 120, default: '' })
  availability: string;

  @Column({ type: 'text', default: '' })
  now_doing: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  socials: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    mastodon?: string;
  };

  @Column({ type: 'text', array: true, default: () => "'{}'::text[]" })
  stack: string[];

  @Column({ type: 'integer', default: 0 })
  portfolio_view_count: number;

  @OneToMany(() => Blog, (b) => b.personal)
  blogs: Blog[];

  @OneToMany(() => PersonalImage, (i) => i.personal)
  images: PersonalImage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
