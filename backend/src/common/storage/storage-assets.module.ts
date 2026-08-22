import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { STORAGE_PROVIDER_TOKEN } from './constants';
import { StorageAsset } from './entities';
import { StorageProvider } from './enums';
import {
  GoogleDriveStorageProvider,
  RegisteredStorageProvider,
  SupabaseStorageProvider,
  StorageProviderRegistry,
} from './providers';
import { StorageAssetRepository } from './repositories';
import { StorageService } from './services';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([StorageAsset])],
  providers: [
    StorageAssetRepository,
    GoogleDriveStorageProvider,
    SupabaseStorageProvider,
    {
      provide: STORAGE_PROVIDER_TOKEN,
      useFactory: (
        googleDriveStorageProvider: GoogleDriveStorageProvider,
        supabaseStorageProvider: SupabaseStorageProvider,
      ): RegisteredStorageProvider[] => [
        {
          provider: StorageProvider.GOOGLE_DRIVE,
          driver: googleDriveStorageProvider,
        },
        {
          provider: StorageProvider.SUPABASE,
          driver: supabaseStorageProvider,
        },
      ],
      inject: [GoogleDriveStorageProvider, SupabaseStorageProvider],
    },
    StorageProviderRegistry,
    StorageService,
  ],
  exports: [StorageAssetRepository, StorageService],
})
export class StorageAssetsModule {}
