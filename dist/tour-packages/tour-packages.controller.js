var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseInterceptors, UploadedFiles, } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TourPackagesService } from './tour-packages.service.js';
let TourPackagesController = class TourPackagesController {
    tourPackagesService;
    constructor(tourPackagesService) {
        this.tourPackagesService = tourPackagesService;
    }
    findAll() {
        return this.tourPackagesService.findAll();
    }
    findByCategory(category) {
        return this.tourPackagesService.findByCategory(category);
    }
    findOne(id) {
        return this.tourPackagesService.findOne(id);
    }
    create(files, body) {
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
    update(id, body) {
        return this.tourPackagesService.update(id, body);
    }
    remove(id) {
        return this.tourPackagesService.remove(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TourPackagesController.prototype, "findAll", null);
__decorate([
    Get('category/:category'),
    __param(0, Param('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TourPackagesController.prototype, "findByCategory", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TourPackagesController.prototype, "findOne", null);
__decorate([
    Post(),
    UseInterceptors(FilesInterceptor('images', 3, {
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
    })),
    __param(0, UploadedFiles()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", void 0)
], TourPackagesController.prototype, "create", null);
__decorate([
    Put(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TourPackagesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TourPackagesController.prototype, "remove", null);
TourPackagesController = __decorate([
    Controller('api/tour-packages'),
    __metadata("design:paramtypes", [TourPackagesService])
], TourPackagesController);
export { TourPackagesController };
//# sourceMappingURL=tour-packages.controller.js.map