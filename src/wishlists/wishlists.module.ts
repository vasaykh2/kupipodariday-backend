import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './entities/wishlist.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [WishlistsService],
  controllers: [WishlistsController],
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
})
export class WishlistsModule {}
