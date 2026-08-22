import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from '../../../../user/entities/user.entity';
import { MapShareSession } from './map-share-session.entity';

@Entity('map_session_members')
export class MapSessionMember {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  session_id: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  location_ready: boolean;

  @Column({ type: 'datetime', nullable: true })
  joined_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  last_location_at: Date | null;

  @ManyToOne(() => MapShareSession, (session) => session.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: MapShareSession;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
