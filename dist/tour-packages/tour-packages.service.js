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
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tourPackages } from '../db/schema.js';
const VALID_CATEGORIES = ['Kerala', 'International', 'NorthEast'];
let TourPackagesService = class TourPackagesService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll() {
        const data = await this.db.select().from(tourPackages).orderBy(desc(tourPackages.createdAt));
        return { success: true, data };
    }
    async findByCategory(category) {
        if (!VALID_CATEGORIES.includes(category)) {
            throw new BadRequestException(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }
        const data = await this.db
            .select()
            .from(tourPackages)
            .where(eq(tourPackages.category, category));
        return { success: true, data };
    }
    async findOne(id) {
        const [result] = await this.db
            .select()
            .from(tourPackages)
            .where(eq(tourPackages.id, id));
        if (!result)
            throw new NotFoundException(`Tour package #${id} not found`);
        return result;
    }
    async create(data) {
        if (!VALID_CATEGORIES.includes(data.category)) {
            throw new BadRequestException(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }
        const [result] = await this.db
            .insert(tourPackages)
            .values({
            location: data.location,
            description: data.description,
            totalDays: data.totalDays,
            price: String(data.price),
            ratings: data.ratings ? String(data.ratings) : '0',
            category: data.category,
            image1: data.image1,
            image2: data.image2,
            image3: data.image3,
        })
            .returning();
        return result;
    }
    async update(id, data) {
        if (data.category &&
            !VALID_CATEGORIES.includes(data.category)) {
            throw new BadRequestException(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }
        const updateData = {};
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.totalDays !== undefined)
            updateData.totalDays = data.totalDays;
        if (data.price !== undefined)
            updateData.price = String(data.price);
        if (data.ratings !== undefined)
            updateData.ratings = String(data.ratings);
        if (data.category !== undefined)
            updateData.category = data.category;
        const [result] = await this.db
            .update(tourPackages)
            .set(updateData)
            .where(eq(tourPackages.id, id))
            .returning();
        if (!result)
            throw new NotFoundException(`Tour package #${id} not found`);
        return result;
    }
    async remove(id) {
        const [result] = await this.db
            .delete(tourPackages)
            .where(eq(tourPackages.id, id))
            .returning();
        if (!result)
            throw new NotFoundException(`Tour package #${id} not found`);
        return { message: `Tour package #${id} deleted` };
    }
};
TourPackagesService = __decorate([
    Injectable(),
    __param(0, Inject('DRIZZLE')),
    __metadata("design:paramtypes", [NodePgDatabase])
], TourPackagesService);
export { TourPackagesService };
//# sourceMappingURL=tour-packages.service.js.map