import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';

import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
    ]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserRepository,
  ],
  exports: [
    UserRepository,
  ],
})
export class UserModule {}