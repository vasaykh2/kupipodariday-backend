import { TransformWishOffersInterceptor } from '../utils/interceptors/transform-wish-offers-inreceptor';
import { TransformOwnerInterceptor } from '../utils/interceptors/transform-owner-interceptor';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('wishes')
@UseGuards(ThrottlerGuard)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishDto,
  ): Promise<Record<string, never>> {
    return await this.wishesService.createWish(dto, user);
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAllWishes(): Promise<Wish[]> {
    return await this.wishesService.findAll();
  }

  @Get('last')
  @UseInterceptors(TransformOwnerInterceptor<Wish[]>)
  @UseInterceptors(TransformWishOffersInterceptor)
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }

  @Get('top')
  @UseInterceptors(TransformOwnerInterceptor<Wish[]>)
  @UseInterceptors(TransformWishOffersInterceptor)
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformOwnerInterceptor<Wish[]>)
  @UseInterceptors(TransformWishOffersInterceptor)
  async getWishById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findById(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ): Promise<Record<string, never>> {
    return await this.wishesService.updateWish(Number(id), dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformOwnerInterceptor<Wish>)
  async deleteWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Wish> {
    return await this.wishesService.deleteById(Number(id), user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Record<string, never>> {
    return await this.wishesService.copyWish(Number(id), user);
  }
}
