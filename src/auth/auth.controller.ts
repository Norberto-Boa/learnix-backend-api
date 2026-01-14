import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
<<<<<<< HEAD
import type { AuthService } from './auth.service';
=======
import { AuthService } from './auth.service';
>>>>>>> 01d1b7dda5cee4b56ccd8ce63e5e8151af2076ff
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { loginSchema, type LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }
}
