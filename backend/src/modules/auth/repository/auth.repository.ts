import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) {}
    findByEmail(email: string) {
        return this.userRepository.findOne({ where: {email},});
    }
    createUser(data: Partial<User>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }
}