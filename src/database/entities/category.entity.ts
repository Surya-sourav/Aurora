import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Personal } from './personal.entity';
import { Blog } from './blog.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 80 })
  slug: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description: string;

  @Column({ type: 'varchar', length: 32, default: '' })
  color: string;

  @Column({ type: 'integer', default: 0 })
  sort_order: number;

  @OneToMany(() => Blog, (b) => b.category)
  blogs: Blog[];

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
