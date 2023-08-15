import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const createJWTConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.get('JWT_SECRET') || 'secret-key',
  signOptions: {
    expiresIn: configService.get('JWT_EXPIRES_IN') || '24h',
  },
});
