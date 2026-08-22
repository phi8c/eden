import { Inject, Injectable } from '@nestjs/common';

import { STORAGE_PROVIDER_TOKEN } from '../constants';
import { StorageProvider } from '../enums';
import { StorageProviderDriver } from '../types';

export type RegisteredStorageProvider = {
  provider: StorageProvider;
  driver: StorageProviderDriver;
};

@Injectable()
export class StorageProviderRegistry {
  private readonly providers = new Map<StorageProvider, StorageProviderDriver>();

  constructor(
    @Inject(STORAGE_PROVIDER_TOKEN)
    registeredProviders: RegisteredStorageProvider[],
  ) {
    registeredProviders.forEach(({ provider, driver }) => {
      this.providers.set(provider, driver);
    });
  }

  get(provider: StorageProvider): StorageProviderDriver {
    const driver = this.providers.get(provider);

    if (!driver) {
      throw new Error(`Storage provider is not registered: ${provider}`);
    }

    return driver;
  }
}
