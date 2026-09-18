import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TourPackagesService } from './tour-packages.service.js';

@Controller('api/tour-packages')
export class TourPackagesController {
  constructor(private readonly tourPackagesService: TourPackagesService) {}

  @Get()
  findAll() {
    return this.tourPackagesService.findAll();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.tourPackagesService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tourPackagesService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      storage: diskStorage({
        destination: 'uploads',
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    body: {
      location: string;
      description?: string;
      totalDays: string;
      price: string;
      ratings?: string;
      category: string;
    },
  ) {
    const images = files?.map((f) => `/uploads/${f.filename}`) ?? [];
    return this.tourPackagesService.create({
      location: body.location,
      description: body.description,
      totalDays: Number(body.totalDays),
      price: Number(body.price),
      ratings: body.ratings ? Number(body.ratings) : 0,
      category: body.category,
      image1: images[0],
      image2: images[1],
      image3: images[2],
    });
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      location?: string;
      description?: string;
      totalDays?: number;
      price?: number;
      ratings?: number;
      category?: string;
    },
  ) {
    return this.tourPackagesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tourPackagesService.remove(id);
  }
}
