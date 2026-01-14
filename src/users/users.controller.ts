import { GetUser } from '@/auth/decorators/get-user.decorator';
import type { UserPayload } from '@/auth/types/user-payload.interface';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guard/auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserBaseDto, UserBaseSchema } from './dto/user-base.dto';
import * as bcrypt from 'bcryptjs';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { CreateUserSchema, type CreateUserDto } from './dto/create-user.dto';
import type z from 'zod';

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

  @Post('create')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async create(@Body() data: CreateUserDto) {
    const doesUserWithSameEmailExist = await this.usersService.findUserByEmail(
      data.email,
    );

    if (doesUserWithSameEmailExist) {
      throw new ConflictException('User with same email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 8);

    const user = await this.usersService.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
    });

    return user;
  }
}
