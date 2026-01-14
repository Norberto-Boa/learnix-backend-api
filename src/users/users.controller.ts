import { GetUser } from '@/auth/decorators/get-user.decorator';
import type { UserPayload } from '@/auth/types/user-payload.interface';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guard/auth.guard';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetUser('userId') id: string) {
    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }
}
