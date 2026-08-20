import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  created_by: number;

  @Column({ type: 'datetime' })
  created_at: Date;
}
