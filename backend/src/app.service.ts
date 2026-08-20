import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { RedisService }
from './infrastructure/redis/redis.service';

@Injectable()
export class AppService
implements OnModuleInit {

  constructor(

    private readonly redis: RedisService,

  ) {}

  async onModuleInit() {

    await this.redis.set(

      'test',

      'hello redis',

    );

    const value =

      await this.redis.get(
        'test',
      );

    console.log(
      'REDIS:',
      value,
    );
  }

  getHello(): string {

    return 'Hello World';

  }

}