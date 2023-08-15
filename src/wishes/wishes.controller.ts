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
import { User } from 'src/users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async createWish(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishDto,
  ): Promise<Record<string, never>> {
    return await this.wishesService.createWish(dto, user);
  }

  @Get()
  async findAllWishes(): Promise<Wish[]> {
    return await this.wishesService.findAll();
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getWishById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findById(Number(id));
  }

  @Patch(':id')
  async updateWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ): Promise<Record<string, never>> {
    return await this.wishesService.updateWish(Number(id), dto, user.id);
  }

  @Delete(':id')
  async deleteWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Wish> {
    return await this.wishesService.deleteById(Number(id), user.id);
  }

  @Post(':id/copy')
  async copyWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Record<string, never>> {
    return await this.wishesService.copyWish(Number(id), user);
  }
}
