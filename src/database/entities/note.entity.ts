import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Personal } from './personal.entity';

@Entity('note')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 200 })
  slug: string;

  @Column({ type: 'varchar', length: 200 })
  heading: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', array: true, default: () => "'{}'::text[]" })
  tags: string[];

  @Column({ type: 'integer', default: 0 })
  view_count: number;

  @Column({ type: 'uuid', nullable: true })
  personal_id: string | null;

  @ManyToOne(() => Personal, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'personal_id' })
  personal: Personal | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
