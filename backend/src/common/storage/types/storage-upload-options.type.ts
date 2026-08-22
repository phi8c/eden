import { StorageProvider, StoragePurpose } from '../enums';

export type StorageFolderContext = {
  environment?: string;
  conversationId?: number;
  sessionId?: number;
  topicId?: number;
};

export type StorageUploadOptions = {
  ownerUserId: number;
  purpose: StoragePurpose;
  buffer: Buffer;
  originalFilename: string;
  mimeType: string;
  sizeBytes?: number;
  provider?: StorageProvider;
  expiresAt?: Date | null;
  folderContext?: StorageFolderContext;
};

export type StorageUploadResult = {
  assetId: number;
  provider: StorageProvider;
  providerFileId: string;
  providerParentId: string | null;
  originalFilename: string;
  storedFilename: string;
  mimeType: string;
  sizeBytes: number | null;
  url: string;
};
