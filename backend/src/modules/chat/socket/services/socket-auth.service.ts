import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { Socket } from 'socket.io';

export interface SocketUser {

  sub: number;

  email: string;

}

@Injectable()
export class SocketAuthService {

  constructor(

    private readonly jwt: JwtService,

  ) {}

  async authenticate(
    client: Socket,
): Promise<SocketUser> {

    const rawToken =

      client.handshake.auth?.token ||

      this.extractBearer(

        client.handshake.headers.authorization,

      );

    const token =

      this.normalizeToken(

        rawToken,

      );

    if (!token) {

      throw new UnauthorizedException(
        'Missing access token',
      );

    }

    try {

     return await this.jwt.verifyAsync<SocketUser>(
  token,
);

    } catch {

      throw new UnauthorizedException(
        'Invalid access token',
      );

    }

  }

  private extractBearer(
    value?: string,
  ) {

    if (!value) {

      return null;

    }

    if (!value.startsWith('Bearer ')) {

      return null;

    }

    return value.substring(7);

  }

  private normalizeToken(
    value?: string | null,
  ) {
    if (!value) {
      return null;
    }

    if (value.startsWith('Bearer ')) {
      return value.substring(7);
    }

    return value;
  }

}
