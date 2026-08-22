import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../../modules/user/entities/user.entity';
import {
  StorageAssetStatus,
  StorageProvider,
  StoragePurpose,
} from '../enums';

@Entity('storage_assets')
export class StorageAsset {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  owner_user_id: number;

  @Column({ type: 'tinyint', unsigned: true })
  provider: StorageProvider;

  @Column({ type: 'tinyint', unsigned: true })
  purpose: StoragePurpose;

  @Column({ type: 'varchar', length: 255 })
  provider_file_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider_parent_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  original_filename: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stored_filename: string | null;

  @Column({ type: 'varchar', length: 100 })
  mime_type: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  size_bytes: number | null;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: StorageAssetStatus.ACTIVE,
  })
  status: StorageAssetStatus;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  expires_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  delete_attempted_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_user_id' })
  owner: User;
}
