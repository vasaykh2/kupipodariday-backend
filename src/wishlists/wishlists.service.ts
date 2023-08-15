import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import {
  USER_NOT_OWNER,
  WISHLIST_NOT_FOUND,
} from 'src/utils/constants/wishlists';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async createWishlist(dto: CreateWishlistDto, user: User): Promise<Wishlist> {
    const wishesArr = await this.wishesService.findManyByIdArr(dto.itemsId);

    await this.wishlistsRepository.save({
      ...dto,
      owner: user,
      items: wishesArr,
    });

    return await this.wishlistsRepository.findOne({
      where: { name: dto.name },
      relations: ['owner', 'items'],
    });
  }

  async findAllWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }

    return wishlist;
  }

  async deleteById(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findById(id);

    if (!wishlist) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_OWNER);
    }

    await this.wishlistsRepository.delete(id);

    return wishlist;
  }

  async updateWishlist(
    id: number,
    dto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findById(id);

    if (!wishlist) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(USER_NOT_OWNER);
    }

    const wishes = await this.wishesService.findManyByIdArr(dto.itemsId || []);

    return await this.wishlistsRepository.save({
      ...wishlist,
      name: dto.name,
      image: dto.image,
      description: dto.description,
      items: wishes.concat(wishlist.items),
    });
  }
}
