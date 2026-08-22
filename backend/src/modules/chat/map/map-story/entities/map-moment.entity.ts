import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Conversation } from '../../../conversations/entities/conversation.entity';
import { User } from '../../../../user/entities/user.entity';
import { MapMomentMedia } from './map-moment-media.entity';
import { MapShareSession } from './map-share-session.entity';

@Entity('map_moments')
export class MapMoment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  session_id: number;

  @Column({ type: 'bigint', unsigned: true })
  conversation_id: number;

  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  accuracy_meters: string | null;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime' })
  visible_until: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => MapShareSession, (session) => session.moments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: MapShareSession;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => MapMomentMedia, (media) => media.moment)
  media: MapMomentMedia[];
}
