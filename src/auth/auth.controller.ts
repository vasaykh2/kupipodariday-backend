import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { USER_ALREADY_EXIST } from 'src/utils/constants/users';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() { user }): Promise<{
    access_token: string;
  }> {
    return this.authService.auth(user);
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const { email } = dto;

    const userInDB = await this.usersService.findByEmail(email);

    if (userInDB) {
      throw new BadRequestException(USER_ALREADY_EXIST);
    }

    const user = await this.usersService.create(dto);
    return this.authService.auth(user);
  }
}
