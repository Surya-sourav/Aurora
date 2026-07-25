import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Personal } from './personal.entity';

@Entity('career')
@Index(['start_date'])
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 160 })
  company_name: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  company_url: string;

  @Column({ type: 'varchar', length: 200 })
  job_title: string;

  @Column({ type: 'varchar', length: 40, default: '' })
  employment_type: string;

  @Column({ type: 'varchar', length: 160, default: '' })
  location: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string | null;

  @Column({ type: 'bytea', select: false, nullable: true })
  logo: Buffer | null;

  @Column({ type: 'varchar', length: 64, default: '' })
  logo_mime: string;

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
