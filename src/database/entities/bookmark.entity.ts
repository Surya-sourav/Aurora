import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Personal } from './personal.entity';

@Entity('bookmark')
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 1000 })
  url: string;

  @Column({ type: 'varchar', length: 300, default: '' })
  title: string;

  @Column({ type: 'text', default: '' })
  note: string;

  @Column({ type: 'text', array: true, default: () => "'{}'::text[]" })
  tags: string[];

  @Column({ type: 'boolean', default: false })
  is_favorite: boolean;

  @Column({ type: 'uuid', nullable: true })
  personal_id: string | null;

  @ManyToOne(() => Personal, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'personal_id' })
  personal: Personal | null;

  @CreateDateColumn()
  created_at: Date;
}
