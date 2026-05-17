import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bytea', select: false })
  data: Buffer;

  @Column({ type: 'varchar', length: 64 })
  mime_type: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  alt_text: string;

  @Column({ type: 'integer' })
  size_bytes: number;

  @Column({ type: 'uuid', nullable: true })
  blog_id: string | null;

  @ManyToOne(() => Blog, (b) => b.images, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog | null;

  @CreateDateColumn()
  created_at: Date;
}
