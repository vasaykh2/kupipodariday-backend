import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [WishesService],
  controllers: [WishesController],
  imports: [TypeOrmModule.forFeature([Wish]), UsersModule],
  exports: [WishesService],
})
export class WishesModule {}
