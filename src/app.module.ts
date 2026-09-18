import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './db/database.module.js';
import { ResortsModule } from './resorts/resorts.module.js';
import { TourPackagesModule } from './tour-packages/tour-packages.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ResortsModule,
    TourPackagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
