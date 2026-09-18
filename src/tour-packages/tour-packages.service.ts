import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tourPackages } from '../db/schema.js';
import * as schema from '../db/schema.js';

const VALID_CATEGORIES = ['Kerala', 'International', 'NorthEast'] as const;

@Injectable()
export class TourPackagesService {
  constructor(
    @Inject('DRIZZLE') private db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    const data = await this.db.select().from(tourPackages).orderBy(desc(tourPackages.createdAt));
    return { success: true, data };
  }

  async findByCategory(category: string) {
    if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
      throw new BadRequestException(
        `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      );
    }
    const data = await this.db
      .select()
      .from(tourPackages)
      .where(eq(tourPackages.category, category));
    return { success: true, data };
  }

  async findOne(id: number) {
    const [result] = await this.db
      .select()
      .from(tourPackages)
      .where(eq(tourPackages.id, id));
    if (!result) throw new NotFoundException(`Tour package #${id} not found`);
    return result;
  }

  async create(data: {
    location: string;
    description?: string;
    totalDays: number;
    price: number;
    ratings?: number;
    category: string;
    image1?: string;
    image2?: string;
    image3?: string;
  }) {
    if (!VALID_CATEGORIES.includes(data.category as (typeof VALID_CATEGORIES)[number])) {
      throw new BadRequestException(
        `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      );
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

  async update(
    id: number,
    data: Partial<{
      location: string;
      description: string;
      totalDays: number;
      price: number;
      ratings: number;
      category: string;
    }>,
  ) {
    if (
      data.category &&
      !VALID_CATEGORIES.includes(data.category as (typeof VALID_CATEGORIES)[number])
    ) {
      throw new BadRequestException(
        `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.location !== undefined) updateData.location = data.location;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.totalDays !== undefined) updateData.totalDays = data.totalDays;
    if (data.price !== undefined) updateData.price = String(data.price);
    if (data.ratings !== undefined) updateData.ratings = String(data.ratings);
    if (data.category !== undefined) updateData.category = data.category;

    const [result] = await this.db
      .update(tourPackages)
      .set(updateData)
      .where(eq(tourPackages.id, id))
      .returning();
    if (!result) throw new NotFoundException(`Tour package #${id} not found`);
    return result;
  }

  async remove(id: number) {
    const [result] = await this.db
      .delete(tourPackages)
      .where(eq(tourPackages.id, id))
      .returning();
    if (!result) throw new NotFoundException(`Tour package #${id} not found`);
    return { message: `Tour package #${id} deleted` };
  }
}
