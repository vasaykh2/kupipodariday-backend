import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { USER_ALREADY_EXIST } from 'src/utils/constants/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(dto);
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();

    return users;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateById(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const emailMatches = await this.findByEmail(dto.email);
      if (emailMatches) {
        throw new BadRequestException(USER_ALREADY_EXIST);
      }
    }

    if (dto.username && dto.username !== user.username) {
      const usernameMatches = await this.findByUsername(dto.username);
      if (usernameMatches) {
        throw new BadRequestException(USER_ALREADY_EXIST);
      }
    }

    const newUserData: User = {
      ...user,
      password: dto?.password,
      email: dto?.email,
      about: dto?.about,
      username: dto?.username,
      avatar: dto?.avatar,
    };
    await this.usersRepository.update(user.id, newUserData);

    return await this.findById(id);
  }

  async getUserWishes(id: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { owner: { id } },
      relationLoadStrategy: 'join',
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

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ username: Like(`${query}%`) }, { email: Like(`${query}%`) }],
    });
  }
}
