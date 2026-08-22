import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';

import { StorageAsset } from '../entities';
import {
  StorageAssetStatus,
  StorageProvider,
  StoragePurpose,
} from '../enums';
import { StorageProviderRegistry } from '../providers';
import { StorageAssetRepository } from '../repositories';
import { StorageFolderContext, StorageUploadOptions, StorageUploadResult } from '../types';

@Injectable()
export class StorageService {
  constructor(
    private readonly assetRepository: StorageAssetRepository,
    private readonly providerRegistry: StorageProviderRegistry,
  ) {}

  async uploadFile(options: StorageUploadOptions): Promise<StorageUploadResult> {
    const provider = options.provider ?? StorageProvider.SUPABASE;
    const driver = this.providerRegistry.get(provider);
    const storedFilename = this.createStoredFilename(options.originalFilename);
    const folderPath = this.buildFolderPath(options.purpose, options.folderContext);
    const uploaded = await driver.upload({
      buffer: options.buffer,
      mimeType: options.mimeType,
      storedFilename,
      folderPath,
    });

    const asset = await this.assetRepository.save(
      this.assetRepository.create({
        owner_user_id: options.ownerUserId,
        provider,
        purpose: options.purpose,
        provider_file_id: uploaded.providerFileId,
        provider_parent_id: uploaded.providerParentId,
        original_filename: options.originalFilename,
        stored_filename: storedFilename,
        mime_type: options.mimeType,
        size_bytes: options.sizeBytes ?? options.buffer.length,
        status: StorageAssetStatus.ACTIVE,
        created_at: new Date(),
        expires_at: options.expiresAt ?? null,
      }),
    );

    return this.toUploadResult(asset, uploaded.url);
  }

  async markDeletePending(assetId: number): Promise<StorageAsset> {
    const asset = await this.assetRepository.findById(assetId);

    if (!asset) {
      throw new NotFoundException('Storage asset not found');
    }

    if (
      asset.status === StorageAssetStatus.DELETED ||
      asset.status === StorageAssetStatus.DELETE_PENDING
    ) {
      return asset;
    }

    await this.assetRepository.update(asset.id, {
      status: StorageAssetStatus.DELETE_PENDING,
      delete_attempted_at: new Date(),
    });

    return {
      ...asset,
      status: StorageAssetStatus.DELETE_PENDING,
      delete_attempted_at: new Date(),
    };
  }

  async deleteAsset(assetId: number): Promise<void> {
    const asset = await this.markDeletePending(assetId);

    if (asset.status === StorageAssetStatus.DELETED) {
      return;
    }

    try {
      const driver = this.providerRegistry.get(asset.provider);

      await driver.delete(asset.provider_file_id);
      await this.assetRepository.update(asset.id, {
        status: StorageAssetStatus.DELETED,
        deleted_at: new Date(),
      });
    } catch (error) {
      await this.assetRepository.update(asset.id, {
        status: StorageAssetStatus.DELETE_FAILED,
        delete_attempted_at: new Date(),
      });

      throw error instanceof Error
        ? error
        : new InternalServerErrorException('Failed to delete storage asset');
    }
  }

  async cleanupExpiredAssets(): Promise<void> {
    const assets = await this.assetRepository.findCleanupCandidates();

    for (const asset of assets) {
      await this.deleteAsset(asset.id);
    }
  }

  async getPublicUrl(asset: StorageAsset): Promise<string> {
    const driver = this.providerRegistry.get(asset.provider);

    if (driver.getPublicUrl) {
      return driver.getPublicUrl(asset.provider_file_id);
    }

    return asset.provider_file_id;
  }

  private createStoredFilename(originalFilename: string): string {
    const extension = extname(originalFilename);

    return `${randomUUID()}${extension}`;
  }

  private buildFolderPath(
    purpose: StoragePurpose,
    context: StorageFolderContext = {},
  ): string[] {
    const environment = context.environment ?? process.env.NODE_ENV ?? 'local';

    if (purpose === StoragePurpose.MAP_MOMENT) {
      return [
        environment,
        'map',
        'moments',
        `conversation-${context.conversationId ?? 'unknown'}`,
        `session-${context.sessionId ?? 'unknown'}`,
      ];
    }

    if (purpose === StoragePurpose.MESSAGE_ATTACHMENT) {
      return [
        'Dove',
        environment,
        'chat',
        'attachments',
        `conversation-${context.conversationId ?? 'unknown'}`,
        `topic-${context.topicId ?? 'unknown'}`,
      ];
    }

    if (purpose === StoragePurpose.AVATAR) {
      return ['Dove', environment, 'avatar'];
    }

    return ['Dove', environment, 'misc'];
  }

  private toUploadResult(asset: StorageAsset, url: string): StorageUploadResult {
    return {
      assetId: asset.id,
      provider: asset.provider,
      providerFileId: asset.provider_file_id,
      providerParentId: asset.provider_parent_id,
      originalFilename: asset.original_filename ?? '',
      storedFilename: asset.stored_filename ?? '',
      mimeType: asset.mime_type,
      sizeBytes: asset.size_bytes,
      url,
    };
  }
}
