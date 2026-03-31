import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';


@Injectable() 
    export class UserService {
        constructor(
         private readonly userRepository: UserRepository,
        ){}

        async getProfile(userId: number) {
            const user = await this.userRepository.findById(userId);
            if(!user) {
                 throw new NotFoundException('User not found');
            }
            const profile = await this.userRepository.findProfile(userId);
            return {
                user,
                profile,
            };
            
        }
        async updateProfile(userId: number, dto: UpdateProfileDto) {

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.userRepository.updateProfile(userId, dto);

    return {
      message: 'Profile updated',
      profile,
    };
  }

    }
