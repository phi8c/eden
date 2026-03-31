import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../../user/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity('conversation_members')
export class ConversationMember {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  conversation_id: number;

  @Column()
  user_id: number;

 @Column({
  type: 'enum',
  enum: ['member', 'admin'],
  default: 'member',
})
role: 'member' | 'admin';

  @Column()
  joined_at: Date;

  @Column({ nullable: true })
  last_read_message_id: number;

  // 🔥 RELATIONS

  @ManyToOne(() => Conversation, (c) => c.members)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}