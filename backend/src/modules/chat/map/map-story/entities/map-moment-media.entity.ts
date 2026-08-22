import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { StorageAsset } from '../../../../../common/storage/entities';
import { MapMoment } from './map-moment.entity';

@Entity('map_moment_media')
export class MapMomentMedia {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  moment_id: number;

  @Column({ type: 'bigint', unsigned: true })
  storage_asset_id: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  sort_order: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @ManyToOne(() => MapMoment, (moment) => moment.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'moment_id' })
  moment: MapMoment;

  @ManyToOne(() => StorageAsset, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'storage_asset_id' })
  storageAsset: StorageAsset;
}
