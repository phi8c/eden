import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { UserProfile } from '../../user/entities/user-profile.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}
  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  async createUser(data: Partial<User>) {
    const user = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(user);

    await this.profileRepository.save(
      this.profileRepository.create({
        userId: savedUser.id,
        displayName: savedUser.username,
      }),
    );

    return savedUser;
  }
}
