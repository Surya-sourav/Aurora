import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Personal } from './personal.entity';
import { Image } from './image.entity';

@Entity('blog')
@Index(['is_published', 'published_at'])
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  heading: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  subheading: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  excerpt: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  signature: string;

  @Column({ type: 'text', array: true, default: () => "'{}'::text[]" })
  tags: string[];

  @Column({ type: 'integer', default: 1 })
  reading_time_minutes: number;

  @Column({ type: 'boolean', default: false })
  is_published: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  published_at: Date | null;

  @Column({ type: 'integer', default: 0 })
  view_count: number;

  @Column({ type: 'uuid', nullable: true })
  personal_id: string | null;

  @ManyToOne(() => Personal, (p) => p.blogs, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'personal_id' })
  personal: Personal | null;

  @OneToMany(() => Image, (img) => img.blog)
  images: Image[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;
}
