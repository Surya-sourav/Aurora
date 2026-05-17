import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Personal } from './personal.entity';

@Entity('personal_image')
@Index(['personal_id', 'sort_order'])
export class PersonalImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bytea', select: false })
  data: Buffer;

  @Column({ type: 'varchar', length: 64 })
  mime_type: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  alt_text: string;

  @Column({ type: 'integer', default: 0 })
  sort_order: number;

  @Column({ type: 'integer' })
  size_bytes: number;

  @Column({ type: 'uuid' })
  personal_id: string;

  @ManyToOne(() => Personal, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personal_id' })
  personal: Personal;

  @CreateDateColumn()
  created_at: Date;
}
