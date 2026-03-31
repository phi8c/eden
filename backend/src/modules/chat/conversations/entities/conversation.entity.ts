import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ConversationMember } from './conversation-member.entity';
import { Message } from '../../messages/entities/message.entity';
import { ConversationType } from '../enums/conversation-type.enum';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

   @Column({
    type: 'enum',
    enum: ConversationType,
  })
  type: ConversationType;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  created_by: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  // ✅ FIX 1: thêm field này
  @Column({ type: 'bigint', unsigned: true, nullable: true })
  last_message_id: number;

  // ✅ FIX 2: thêm field này
  @Column({ type: 'datetime', nullable: true })
  last_message_at: Date;

  // ✅ OPTIONAL (chuẩn hơn - relation)
  @ManyToOne(() => Message)
  @JoinColumn({ name: 'last_message_id' })
  last_message: Message;

  @OneToMany(() => ConversationMember, (m) => m.conversation)
  members: ConversationMember[];
}