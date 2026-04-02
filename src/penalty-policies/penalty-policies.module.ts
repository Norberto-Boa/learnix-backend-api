import { Module } from '@nestjs/common';
import { PenaltyPoliciesController } from './penalty-policies.controller';

@Module({
  controllers: [PenaltyPoliciesController],
})
export class PenaltyPoliciesModule {}
