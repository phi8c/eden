import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Repository } from 'typeorm';

import { StorageAsset } from '../entities';
import { StorageAssetStatus } from '../enums';

@Injectable()
export class StorageAssetRepository {
  constructor(
    @InjectRepository(StorageAsset)
    private readonly repository: Repository<StorageAsset>,
  ) {}

  create(data: Partial<StorageAsset>) {
    return this.repository.create(data);
  }

  save(asset: StorageAsset) {
    return this.repository.save(asset);
  }

  findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, data: Partial<StorageAsset>) {
    return this.repository.update(id, data);
  }

  findCleanupCandidates(now = new Date()) {
    return this.repository.find({
      where: [
        {
          status: StorageAssetStatus.DELETE_FAILED,
        },
        {
          status: In([
            StorageAssetStatus.ACTIVE,
            StorageAssetStatus.DELETE_FAILED,
          ]),
          expires_at: LessThanOrEqual(now),
        },
      ],
      take: 100,
    });
  }
}
