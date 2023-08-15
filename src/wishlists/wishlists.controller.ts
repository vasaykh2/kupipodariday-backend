import { ThrottlerGuard } from '@nestjs/throttler';
import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { TransformOwnerInterceptor } from 'src/utils/interceptors/transform-owner-interceptor';
import { Wishlist } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
@UseGuards(ThrottlerGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseInterceptors(TransformOwnerInterceptor<Wishlist>)
  async createWishlist(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.createWishlist(dto, user);
  }

  @Patch(':id')
  @UseInterceptors(TransformOwnerInterceptor<Wishlist>)
  async updateWishlist(
    @Req() { user }: { user: User },
    @Param('id') wishId: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateWishlist(
      Number(wishId),
      dto,
      user.id,
    );
  }

  @Get()
  @UseInterceptors(TransformOwnerInterceptor<Wishlist[]>)
  async getWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAllWishlists();
  }

  @Get(':id')
  @UseInterceptors(TransformOwnerInterceptor<Wishlist>)
  async getWishlistById(@Param('id') wishId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistsService.findById(Number(wishId));

    return wishlist;
  }

  @Delete(':id')
  @UseInterceptors(TransformOwnerInterceptor<Wishlist>)
  async deleteWishlist(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.deleteById(id, user.id);
  }
}
