import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Friendship } from '../entities/friendship.entity';

@Injectable()
export class FriendshipRepository {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}
  async findByUsers(userA: number, userB: number) {
    const user1 = Math.min(userA, userB);
    const user2 = Math.max(userA, userB);

    return this.friendshipRepository.findOne({
      where: { user1_id: user1, user2_id: user2 },
    });
  }
  async createfriendship(data: Partial<Friendship>) {
    const friendship = this.friendshipRepository.create(data);
    return this.friendshipRepository.save(friendship);
  }

  async updateStatus(id: number, status: number) {
    return this.friendshipRepository.update(id, {
      status,
      updated_at: new Date(),
    });

    {
    }
  }
  async findFriends(userId: number) {
    return this.friendshipRepository
      .createQueryBuilder('f')
      .where('(f.user1_id = :userId OR f.user2_id = :userId)', { userId })
      .andWhere('f.status = :status', { status: 1 })
      .getMany();
  }

  async findPendingRequests(userId: number) {
    return this.friendshipRepository.find({
      where: { user2_id: userId, status: 0 },
    });
  }
  async findById(id: number) {
  return this.friendshipRepository.findOne({
    where: { id },
  });
}

async delete(id: number) {
  const friendship = await this.friendshipRepository.findOne({
    where: { id },
  });

  if (!friendship) return null;

  await this.friendshipRepository.delete(id);
  return true;
}
}
