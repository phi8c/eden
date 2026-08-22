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
import {
  MapShareSessionEndReason,
  MapShareSessionStatus,
} from '../enums';
import { MapSessionMember } from './map-session-member.entity';
import { MapMoment } from './map-moment.entity';

@Entity('map_share_sessions')
export class MapShareSession {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  conversation_id: number;

  @Column({ type: 'bigint', unsigned: true })
  requested_by: number;

  @Column({ type: 'bigint', unsigned: true })
  requested_to: number;

  @Column({ type: 'smallint', unsigned: true })
  duration_minutes: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: MapShareSessionStatus.PENDING,
  })
  status: MapShareSessionStatus;

  @Column({ type: 'datetime' })
  requested_at: Date;

  @Column({ type: 'datetime', nullable: true })
  accepted_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  started_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  expires_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  ended_at: Date | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  ended_by: number | null;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  end_reason: MapShareSessionEndReason | null;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requested_by' })
  requester: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requested_to' })
  recipient: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ended_by' })
  endedByUser: User | null;

  @OneToMany(() => MapSessionMember, (member) => member.session)
  members: MapSessionMember[];

  @OneToMany(() => MapMoment, (moment) => moment.session)
  moments: MapMoment[];
}
