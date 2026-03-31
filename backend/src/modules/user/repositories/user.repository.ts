import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(UserProfile)
        private readonly profileRepo: Repository<UserProfile>,

    ){}

    async findById(id: number) {
        return this.userRepo.findOne({
            where: {id},
        });
    }

  async findProfile(userId: number) {
    return this.profileRepo.findOne({
      where: { user_id: userId },
    });
  }
   async updateProfile(userId: number, data: Partial<UserProfile>) {
    await this.profileRepo.update(
      { user_id: userId },
      data,
    );

    return this.findProfile(userId);
  }
}