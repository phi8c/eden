import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Message } from './message.entity';

@Entity('message_attachments')
export class MessageAttachment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  message_id: number;

  @Column({ type: 'text' })
  file_url: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  file_type: string | null;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: Message;
}
