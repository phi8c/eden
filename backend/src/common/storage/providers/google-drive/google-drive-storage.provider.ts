import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drive_v3, google } from 'googleapis';
import { Readable } from 'stream';

import {
  ProviderUploadInput,
  ProviderUploadResult,
  StorageProviderDriver,
} from '../../types';

@Injectable()
export class GoogleDriveStorageProvider implements StorageProviderDriver {
  private driveClient: drive_v3.Drive | null = null;
  private rootFolderId: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  async upload(input: ProviderUploadInput): Promise<ProviderUploadResult> {
    const drive = this.getDriveClient();
    const parentId = await this.ensureFolderPath(input.folderPath);

    const response = await drive.files.create({
      requestBody: {
        name: input.storedFilename,
        parents: [parentId],
      },
      media: {
        mimeType: input.mimeType,
        body: Readable.from(input.buffer),
      },
      fields: 'id',
    });

    const fileId = response.data.id;

    if (!fileId) {
      throw new InternalServerErrorException(
        'Google Drive did not return a file id after upload',
      );
    }

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      providerFileId: fileId,
      providerParentId: parentId,
      url: `https://drive.google.com/uc?id=${fileId}`,
    };
  }

  async delete(providerFileId: string): Promise<void> {
    const drive = this.getDriveClient();

    await drive.files.delete({
      fileId: providerFileId,
    });
  }

  async getPublicUrl(providerFileId: string): Promise<string> {
    return `https://drive.google.com/uc?id=${providerFileId}`;
  }

  private getDriveClient(): drive_v3.Drive {
    if (this.driveClient) {
      return this.driveClient;
    }

    const clientEmail =
      this.configService.get<string>('googleDrive.clientEmail') ??
      this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const privateKey = (
      this.configService.get<string>('googleDrive.privateKey') ??
      this.configService.get<string>('GOOGLE_PRIVATE_KEY')
    )?.replace(/\\n/g, '\n');
    const folderId =
      this.configService.get<string>('googleDrive.folderId') ??
      this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');

    if (!clientEmail || !privateKey || !folderId) {
      throw new InternalServerErrorException(
        'Missing Google Drive env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID',
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.rootFolderId = folderId;
    this.driveClient = google.drive({ version: 'v3', auth });

    return this.driveClient;
  }

  private async ensureFolderPath(folderPath: string[]): Promise<string> {
    const drive = this.getDriveClient();
    const rootFolderId = this.rootFolderId;

    if (!rootFolderId) {
      throw new InternalServerErrorException('Google Drive root folder is not set');
    }

    let parentId = rootFolderId;

    for (const rawName of folderPath) {
      const folderName = this.normalizeFolderName(rawName);
      const existing = await this.findFolder(drive, parentId, folderName);

      if (existing) {
        parentId = existing;
        continue;
      }

      const created = await this.createFolder(drive, parentId, folderName);

      if (!created.data.id) {
        throw new InternalServerErrorException(
          `Google Drive did not return a folder id for ${folderName}`,
        );
      }

      parentId = created.data.id;
    }

    return parentId;
  }

  private async createFolder(
    drive: drive_v3.Drive,
    parentId: string,
    folderName: string,
  ) {
    try {
      return await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
        },
        fields: 'id',
      });
    } catch (error) {
      const status = this.getGoogleErrorStatus(error);

      if (status === 404) {
        throw new BadGatewayException(
          'Google Drive root folder was not found or is not shared with the service account. Check GOOGLE_DRIVE_FOLDER_ID and folder permissions.',
        );
      }

      throw error;
    }
  }

  private async findFolder(
    drive: drive_v3.Drive,
    parentId: string,
    folderName: string,
  ): Promise<string | null> {
    const escapedName = folderName.replace(/'/g, "\\'");
    const response = await drive.files.list({
      q: [
        `'${parentId}' in parents`,
        `name = '${escapedName}'`,
        `mimeType = 'application/vnd.google-apps.folder'`,
        'trashed = false',
      ].join(' and '),
      fields: 'files(id)',
      pageSize: 1,
    });

    return response.data.files?.[0]?.id ?? null;
  }

  private normalizeFolderName(value: string): string {
    return value.replace(/[\\/]/g, '-').trim();
  }

  private getGoogleErrorStatus(error: unknown): number | null {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof error.status === 'number'
    ) {
      return error.status;
    }

    return null;
  }
}
