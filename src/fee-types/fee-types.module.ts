import { Module } from '@nestjs/common';
import { FeeTypesController } from './fee-types.controller';

@Module({
  controllers: [FeeTypesController],
})
export class FeeTypesModule { }
