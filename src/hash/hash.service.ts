import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private configService: ConfigService) {}

  async hash(password: string): Promise<string> {
    const saltOrRounds = +this.configService.get('SALT_OR_ROUNDS') || 10;
    const salt = await genSalt(saltOrRounds);
    return await hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
