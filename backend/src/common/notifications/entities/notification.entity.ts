import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Conversation } from '../../../modules/chat/conversations/entities/conversation.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { NotificationType } from '../enums';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  actor_id: number | null;

  @Column({ type: 'smallint', unsigned: true })
  type: NotificationType;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  conversation_id: number | null;

  @Column({ type: 'json', nullable: true })
  data: Record<string, unknown> | null;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  read_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  expires_at: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'actor_id' })
  actor: User | null;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation | null;
}
