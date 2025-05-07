import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  revenueToday: number;

  @Column()
  visitors: number;

  @Column()
  transactions: number;

  @Column()
  inventory: number;

  @CreateDateColumn()
  createdAt: Date;
}
