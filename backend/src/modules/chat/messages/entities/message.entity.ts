import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Topic } from '../../topics/entities/topic.entity';
import { MessageAttachment } from './message-attachment.entity';
import { MessageReaction } from './message-reaction.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  conversation_id: number;

  @Column()
  topic_id: number;

  @Column()
  sender_id: number;

  @Column({ type: 'tinyint', unsigned: true, default: 1 })
  type: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  edited_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => Topic)
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @OneToMany(() => MessageAttachment, (attachment) => attachment.message)
  attachments: MessageAttachment[];

  @OneToMany(() => MessageReaction, (reaction) => reaction.message)
  reactions: MessageReaction[];
}
