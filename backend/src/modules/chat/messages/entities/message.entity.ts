import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Topic } from '../../topics/entities/topic.entity';

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

  @Column({ default: 1 })
  type: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  edited_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Topic)
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;
}
