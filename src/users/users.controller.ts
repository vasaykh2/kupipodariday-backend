import { ThrottlerGuard } from '@nestjs/throttler';
import { TransformWishOffersInterceptor } from './../interceptors/transform-wish-offers-inreceptor';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './../wishes/entities/wish.entity';
import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { USER_DOES_NOT_EXIST } from 'src/utils/constants/users';
@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getAuthUser(@Req() { user }: { user: User }): Promise<User> {
    const userProfileData = await this.usersService.findById(user.id);

    if (!userProfileData) {
      throw new NotFoundException();
    }

    return userProfileData;
  }

  @Patch('me')
  async updateAuthUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateById(user.id, dto);
  }

  @Get('me/wishes')
  @UseInterceptors(TransformWishOffersInterceptor)
  async getAuthUserWishes(@Req() { user }: { user: User }): Promise<Wish[]> {
    return await this.usersService.getUserWishes(Number(user.id));
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }

    return user;
  }

  @Get(':username/wishes')
  @UseInterceptors(TransformWishOffersInterceptor)
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }

    return await this.usersService.getUserWishes(Number(user.id));
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }
}
