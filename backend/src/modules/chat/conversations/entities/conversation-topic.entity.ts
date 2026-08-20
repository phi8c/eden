import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('conversation_topics')
export class ConversationTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  conversation_id: number;

  @Column({ type: 'bigint', unsigned: true })
  topic_id: number;
}
