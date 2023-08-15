import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { INCORRECT_USERNAME_OR_PASSWORD } from 'src/utils/constants/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException(INCORRECT_USERNAME_OR_PASSWORD);
    }

    const isPasswordCorrect: boolean = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(INCORRECT_USERNAME_OR_PASSWORD);
    }

    return user;
  }
}
