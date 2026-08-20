import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('message_deliveries')
export class MessageDelivery {
  @PrimaryColumn()
  message_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  delivered_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  read_at: Date;
}
