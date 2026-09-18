import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema.js';
export declare class ResortsService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    findAll(page?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            id: number;
            location: string;
            description: string | null;
            price: string;
            ratings: string | null;
            image1: string | null;
            image2: string | null;
            image3: string | null;
            createdAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        id: number;
        location: string;
        description: string | null;
        price: string;
        ratings: string | null;
        image1: string | null;
        image2: string | null;
        image3: string | null;
        createdAt: Date | null;
    }>;
    create(data: {
        location: string;
        description?: string;
        price: number;
        ratings?: number;
        image1?: string;
        image2?: string;
        image3?: string;
    }): Promise<{
        id: number;
        location: string;
        description: string | null;
        price: string;
        ratings: string | null;
        image1: string | null;
        image2: string | null;
        image3: string | null;
        createdAt: Date | null;
    }>;
    update(id: number, data: Partial<{
        location: string;
        description: string;
        price: number;
        ratings: number;
    }>): Promise<{
        id: number;
        location: string;
        description: string | null;
        price: string;
        ratings: string | null;
        image1: string | null;
        image2: string | null;
        image3: string | null;
        createdAt: Date | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
