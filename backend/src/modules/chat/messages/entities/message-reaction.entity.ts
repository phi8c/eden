import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Message } from './message.entity';

@Entity('message_reactions')
export class MessageReaction {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  message_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  reaction: string | null;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Message, (message) => message.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: Message;
}
