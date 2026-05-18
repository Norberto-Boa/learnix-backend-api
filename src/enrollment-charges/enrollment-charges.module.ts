import { Module } from '@nestjs/common';
import { EnrollmentChargesController } from './enrollment-charges.controller';

@Module({
  controllers: [EnrollmentChargesController],
  providers: [],
})
export class EnrollmentChargesModule {}
