import { Module } from '@nestjs/common';
import { FeeStructuresController } from './fee-structures.controller';

@Module({
  controllers: [FeeStructuresController],
  providers: [],
})
export class FeeStructuresModule { }
