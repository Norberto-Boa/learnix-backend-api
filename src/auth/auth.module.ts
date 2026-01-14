import { EnvModule } from '@/env/env.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvService } from '../env/env.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
<<<<<<< HEAD
      inject: [EnvModule],
      global: true,
      useFactory(env: EnvService) {
        return {
          secret: env.get('JWT_SECRET'),
=======
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        return {
          secret: env.get('JWT_SECRET_KEY'),
>>>>>>> 01d1b7dda5cee4b56ccd8ce63e5e8151af2076ff
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
