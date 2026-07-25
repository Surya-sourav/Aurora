import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity('blog_revision')
@Index(['blog_id', 'created_at'])
export class BlogRevision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  blog_id: string;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @Column({ type: 'varchar', length: 255 })
  heading: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  subheading: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  excerpt: string;

  @Column({ type: 'text', array: true, default: () => "'{}'::text[]" })
  tags: string[];

  @CreateDateColumn()
  created_at: Date;
}
