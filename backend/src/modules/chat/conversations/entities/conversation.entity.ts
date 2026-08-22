import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { ConversationMember } from './conversation-member.entity';
import { Message } from '../../messages/entities/message.entity';
import { ConversationType } from '../enums/conversation-type.enum';
import { Topic } from '../../topics/entities/topic.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
  })
  type: ConversationType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  created_by: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  last_message_id: number;

  @Column({ type: 'datetime', nullable: true })
  last_message_at: Date;

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'last_message_id' })
  last_message: Message;

  @OneToMany(() => ConversationMember, (m) => m.conversation)
  members: ConversationMember[];

  @ManyToMany(() => Topic)
  @JoinTable({
    name: 'conversation_topics',
    joinColumn: {
      name: 'conversation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'topic_id',
      referencedColumnName: 'id',
    },
  })
  topics: Topic[];
}
