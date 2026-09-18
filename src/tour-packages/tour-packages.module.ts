import { Module } from '@nestjs/common';
import { TourPackagesController } from './tour-packages.controller.js';
import { TourPackagesService } from './tour-packages.service.js';

@Module({
  controllers: [TourPackagesController],
  providers: [TourPackagesService],
  exports: [TourPackagesService],
})
export class TourPackagesModule {}
