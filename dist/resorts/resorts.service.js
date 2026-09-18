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
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc, sql, or, ilike } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { resorts } from '../db/schema.js';
let ResortsService = class ResortsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll(page = 1, limit = 12, search) {
        const offset = (page - 1) * limit;
        const term = search?.trim();
        const where = term
            ? or(ilike(resorts.location, `%${term}%`), ilike(resorts.description, `%${term}%`))
            : undefined;
        const [countResult] = await this.db
            .select({ count: sql `count(*)` })
            .from(resorts)
            .where(where);
        const total = Number(countResult.count);
        const data = await this.db
            .select()
            .from(resorts)
            .where(where)
            .orderBy(desc(resorts.createdAt))
            .limit(limit)
            .offset(offset);
        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const [result] = await this.db
            .select()
            .from(resorts)
            .where(eq(resorts.id, id));
        if (!result)
            throw new NotFoundException(`Resort #${id} not found`);
        return result;
    }
    async create(data) {
        const [result] = await this.db
            .insert(resorts)
            .values({
            location: data.location,
            description: data.description,
            price: String(data.price),
            ratings: data.ratings ? String(data.ratings) : '0',
            image1: data.image1,
            image2: data.image2,
            image3: data.image3,
        })
            .returning();
        return result;
    }
    async update(id, data) {
        const updateData = {};
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price !== undefined)
            updateData.price = String(data.price);
        if (data.ratings !== undefined)
            updateData.ratings = String(data.ratings);
        const [result] = await this.db
            .update(resorts)
            .set(updateData)
            .where(eq(resorts.id, id))
            .returning();
        if (!result)
            throw new NotFoundException(`Resort #${id} not found`);
        return result;
    }
    async remove(id) {
        const [result] = await this.db
            .delete(resorts)
            .where(eq(resorts.id, id))
            .returning();
        if (!result)
            throw new NotFoundException(`Resort #${id} not found`);
        return { message: `Resort #${id} deleted` };
    }
};
ResortsService = __decorate([
    Injectable(),
    __param(0, Inject('DRIZZLE')),
    __metadata("design:paramtypes", [NodePgDatabase])
], ResortsService);
export { ResortsService };
//# sourceMappingURL=resorts.service.js.map