import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';

import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

import {GetProfileUseCase} from './application/get-profile.usecase'
import {UpdateProfileUseCase} from './application/update-profile.usecase'
import {SearchUsersUseCase} from './application/search-users.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  controllers: [UserController],
  providers: [ UserService,

 UserRepository,

 GetProfileUseCase,

 UpdateProfileUseCase,

 SearchUsersUseCase,],
  exports: [UserRepository],
})
export class UserModule {}
