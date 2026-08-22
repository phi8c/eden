export type ProviderUploadInput = {
  buffer: Buffer;
  mimeType: string;
  storedFilename: string;
  folderPath: string[];
};

export type ProviderUploadResult = {
  providerFileId: string;
  providerParentId: string | null;
  url: string;
};

export interface StorageProviderDriver {
  upload(input: ProviderUploadInput): Promise<ProviderUploadResult>;
  delete(providerFileId: string): Promise<void>;
  getPublicUrl?(providerFileId: string): Promise<string>;
}
