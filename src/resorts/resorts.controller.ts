import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ResortsService } from './resorts.service.js';

@Controller('api/resorts')
export class ResortsController {
  constructor(private readonly resortsService: ResortsService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.resortsService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 12,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resortsService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
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
    @Body() body: { location: string; description?: string; price: string; ratings?: string },
  ) {
    const images = files?.map((f) => `/uploads/${f.filename}`) ?? [];
    return this.resortsService.create({
      location: body.location,
      description: body.description,
      price: Number(body.price),
      ratings: body.ratings ? Number(body.ratings) : 0,
      image1: images[0],
      image2: images[1],
      image3: images[2],
    });
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { location?: string; description?: string; price?: number; ratings?: number },
  ) {
    return this.resortsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.resortsService.remove(id);
  }
}
