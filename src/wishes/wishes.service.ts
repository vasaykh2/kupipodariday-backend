import { NotFoundException } from '@nestjs/common/exceptions';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import {
  RAISED_NOT_NULL,
  USER_NOT_OWNER,
  WISH_NOT_FOUND,
} from 'src/utils/constants/wishes';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: ['owner', 'offers'],
    });

    return wishes;
  }

  async findManyByIdArr(idArr: number[]): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { id: In(idArr) },
    });
  }

  async createWish(
    dto: CreateWishDto,
    user: User,
  ): Promise<Record<string, never>> {
    await this.wishesRepository.save({
      ...dto,
      owner: user,
    });

    return {};
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'desc' },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });

    if (!wish) {
      throw new NotFoundException('По запросу ничего не найдено');
    }

    return wish;
  }

  async updateWish(
    wishId: number,
    dto: UpdateWishDto,
    userId: number,
  ): Promise<Record<string, never>> {
    const wish = await this.findById(wishId);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (wish.raised > 0) {
      throw new BadRequestException(RAISED_NOT_NULL);
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_OWNER);
    }

    await this.wishesRepository.update(wishId, dto);

    return {};
  }

  async updateWishRaised(
    wishId: number,
    raised: number,
  ): Promise<Record<string, never>> {
    await this.wishesRepository.update(wishId, { raised });
    return {};
  }

  async deleteById(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findById(wishId);
    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_OWNER);
    }

    await this.wishesRepository.delete(wishId);

    return wish;
  }

  async copyWish(wishId: number, user: User): Promise<Record<string, never>> {
    const wish = await this.wishesRepository.findOneBy({ id: wishId });

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;

    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    const wishCopy = {
      ...wish,
      owner: user,
      copied: 0,
      raised: 0,
      offers: [],
    };

    await this.createWish(wishCopy, user);

    return {};
  }
}
