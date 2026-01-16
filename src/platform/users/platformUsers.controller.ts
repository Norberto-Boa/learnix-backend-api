import { Roles } from '@/auth/decorators/roles.decorator';
import { UsersService } from '@/users/users.service';
import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  createUserAdminSchema,
  type CreateUserAdminDTO,
} from './dto/create-user-admin.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import * as bcrypt from 'bcryptjs';
import { SchoolsService } from '@/schools/schools.service';
import { RolesGuard } from '@/auth/guard/roles.guard';

@Controller()
export class PlatformUsersController {
  constructor(
    private coreUsersService: UsersService,
    private coreSchoolsService: SchoolsService,
  ) {}
  @Post()
  @Roles('SUPERADMIN')
  @UseGuards(RolesGuard)
  @UsePipes()
  async createAdmin(
    @Body(new ZodValidationPipe(createUserAdminSchema))
    { name, email, role, schoolId }: CreateUserAdminDTO,
    @GetUser('id') id: string,
  ) {
    const doesUserWithSameEmailExist =
      await this.coreUsersService.findUserByEmail(email);

    if (doesUserWithSameEmailExist) {
      throw new ConflictException('Usuario com este email ja existe!');
    }

    const doesSchoolIdExist =
      await this.coreSchoolsService.findSchoolById(schoolId);

    if (!doesSchoolIdExist) {
      throw new ConflictException('A escola escolhida nao existe');
    }

    if (doesSchoolIdExist.status !== 'ACTIVO') {
      throw new ConflictException(
        'A escola tem algum problema, verifique a antes de criar um usuario!',
      );
    }

    const defaultPassword = 'Admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 8);

    const user = await this.coreUsersService.create({
      name,
      email,
      password: hashedPassword,
      role,
      schoolId,
    });

    return user;
  }
}
