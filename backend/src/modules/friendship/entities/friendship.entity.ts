import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('friendships')
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: false })
  user1_id: number;

  @Column({ type: 'bigint', nullable: false })
  user2_id: number;

  @Column({ type: 'int', nullable: false })
  requester_id: number;

  @Column({ type: 'int', nullable: false })
  status: number;

  @Column({ type: 'date' })
  created_at: Date;
  @Column({ type: 'date' })
  updated_at: Date;
}
