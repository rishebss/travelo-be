import { Module } from '@nestjs/common';
import { ResortsController } from './resorts.controller.js';
import { ResortsService } from './resorts.service.js';

@Module({
  controllers: [ResortsController],
  providers: [ResortsService],
  exports: [ResortsService],
})
export class ResortsModule {}
