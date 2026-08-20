import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../../user/entities/user.entity';
import { Conversation } from './conversation.entity';

export enum ConversationMemberRole {
  MEMBER = 'member',
  ADMIN = 'admin',
}

@Entity('conversation_members')
export class ConversationMember {

  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  conversation_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  user_id: number;

  @Column({
    type: 'enum',
    enum: ConversationMemberRole,
    default: ConversationMemberRole.MEMBER,
  })
  role: ConversationMemberRole;

  @Column({
    type: 'timestamp',
  })
  joined_at: Date;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  last_read_message_id: number | null;

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.members,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'conversation_id',
  })
  conversation: Conversation;

  @ManyToOne(
    () => User,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'user_id',
  })
  user: User;
}