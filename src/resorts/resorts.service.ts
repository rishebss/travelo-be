import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc, sql, or, ilike } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { resorts } from '../db/schema.js';
import * as schema from '../db/schema.js';

@Injectable()
export class ResortsService {
  constructor(
    @Inject('DRIZZLE') private db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll(page: number = 1, limit: number = 12, search?: string) {
    const offset = (page - 1) * limit;

    const term = search?.trim();
    const where = term
      ? or(
          ilike(resorts.location, `%${term}%`),
          ilike(resorts.description, `%${term}%`),
        )
      : undefined;

    const [countResult] = await this.db
      .select({ count: sql<number>`count(*)` })
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

  async findOne(id: number) {
    const [result] = await this.db
      .select()
      .from(resorts)
      .where(eq(resorts.id, id));
    if (!result) throw new NotFoundException(`Resort #${id} not found`);
    return result;
  }

  async create(data: {
    location: string;
    description?: string;
    price: number;
    ratings?: number;
    image1?: string;
    image2?: string;
    image3?: string;
  }) {
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

  async update(
    id: number,
    data: Partial<{
      location: string;
      description: string;
      price: number;
      ratings: number;
    }>,
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.location !== undefined) updateData.location = data.location;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = String(data.price);
    if (data.ratings !== undefined) updateData.ratings = String(data.ratings);

    const [result] = await this.db
      .update(resorts)
      .set(updateData)
      .where(eq(resorts.id, id))
      .returning();
    if (!result) throw new NotFoundException(`Resort #${id} not found`);
    return result;
  }

  async remove(id: number) {
    const [result] = await this.db
      .delete(resorts)
      .where(eq(resorts.id, id))
      .returning();
    if (!result) throw new NotFoundException(`Resort #${id} not found`);
    return { message: `Resort #${id} deleted` };
  }
}
