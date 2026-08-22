import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import {
  ProviderUploadInput,
  ProviderUploadResult,
  StorageProviderDriver,
} from '../../types';

const SIGNED_URL_EXPIRES_IN_SECONDS = 3600;

@Injectable()
export class SupabaseStorageProvider implements StorageProviderDriver {
  private client: SupabaseClient | null = null;
  private bucket: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  async upload(input: ProviderUploadInput): Promise<ProviderUploadResult> {
    const client = this.getClient();
    const bucket = this.getBucket();
    const path = [...input.folderPath, input.storedFilename].join('/');

    const { error } = await client.storage
      .from(bucket)
      .upload(path, input.buffer, {
        contentType: input.mimeType,
        upsert: false,
      });

    if (error) {
      throw new BadGatewayException(`Supabase upload failed: ${error.message}`);
    }

    return {
      providerFileId: path,
      providerParentId: input.folderPath.join('/'),
      url: await this.createSignedUrl(path),
    };
  }

  async delete(providerFileId: string): Promise<void> {
    const client = this.getClient();
    const bucket = this.getBucket();
    const { error } = await client.storage.from(bucket).remove([providerFileId]);

    if (error) {
      throw new BadGatewayException(`Supabase delete failed: ${error.message}`);
    }
  }

  getPublicUrl(providerFileId: string): Promise<string> {
    return this.createSignedUrl(providerFileId);
  }

  private async createSignedUrl(path: string): Promise<string> {
    const client = this.getClient();
    const bucket = this.getBucket();
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(path, SIGNED_URL_EXPIRES_IN_SECONDS);

    if (error || !data) {
      throw new BadGatewayException(
        `Supabase signed URL failed: ${error?.message ?? 'unknown error'}`,
      );
    }

    return data.signedUrl;
  }

  private getClient(): SupabaseClient {
    if (this.client) {
      return this.client;
    }

    const url =
      this.configService.get<string>('supabaseStorage.url') ??
      this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey =
      this.configService.get<string>('supabaseStorage.serviceRoleKey') ??
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !serviceRoleKey) {
      throw new BadGatewayException(
        'Missing Supabase env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY',
      );
    }

    this.client = createClient(url, serviceRoleKey);

    return this.client;
  }

  private getBucket(): string {
    if (this.bucket) {
      return this.bucket;
    }

    const bucket =
      this.configService.get<string>('supabaseStorage.bucket') ??
      this.configService.get<string>('SUPABASE_STORAGE_BUCKET');

    if (!bucket) {
      throw new BadGatewayException(
        'Missing Supabase env var: SUPABASE_STORAGE_BUCKET',
      );
    }

    this.bucket = bucket;

    return this.bucket;
  }
}
