import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { IsString, Length, IsEmail, IsUrl, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AVATAR_DEFAULT_LINK,
  ABOUT_DEFAULT_TEXT,
} from 'src/utils/constants/users';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    unique: true,
    length: 30,
  })
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({ type: 'varchar', length: 200, default: ABOUT_DEFAULT_TEXT })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: AVATAR_DEFAULT_LINK })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
