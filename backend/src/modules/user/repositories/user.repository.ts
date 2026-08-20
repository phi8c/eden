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
  ) {}

  async findById(id: number) {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  async findProfile(userId: number) {
    return this.profileRepo.findOne({
      where: {
        userId,
      },
    });
  }

  async updateProfile(
    userId: number,
    data: Partial<UserProfile>,
  ) {
    await this.profileRepo.update(
      {
        userId,
      },
      data,
    );

    return this.findProfile(userId);
  }

  async searchByEmail(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
      ])
      .where('user.email LIKE :q', {
        q: `%${email}%`,
      })
      .limit(10)
      .getMany();
  }
}