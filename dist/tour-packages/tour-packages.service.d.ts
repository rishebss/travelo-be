import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema.js';
export declare class TourPackagesService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    findAll(): Promise<{
        success: boolean;
        data: {
            id: number;
            location: string;
            description: string | null;
            totalDays: number;
            price: string;
            ratings: string | null;
            category: string;
            image1: string | null;
            image2: string | null;
            image3: string | null;
            createdAt: Date | null;
        }[];
    }>;
    findByCategory(category: string): Promise<{
        success: boolean;
        data: {
            id: number;
            location: string;
            description: string | null;
            totalDays: number;
            price: string;
            ratings: string | null;
            category: string;
            image1: string | null;
            image2: string | null;
            image3: string | null;
            createdAt: Date | null;
        }[];
    }>;
    findOne(id: number): Promise<{
        id: number;
        location: string;
        description: string | null;
        totalDays: number;
        price: string;
        ratings: string | null;
        category: string;
        image1: string | null;
        image2: string | null;
        image3: string | null;
        createdAt: Date | null;
    }>;
    create(data: {
        location: string;
        description?: string;
        totalDays: number;
        price: number;
        ratings?: number;
        category: string;
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
        totalDays: number;
        category: string;
    }>;
    update(id: number, data: Partial<{
        location: string;
        description: string;
        totalDays: number;
        price: number;
        ratings: number;
        category: string;
    }>): Promise<{
        id: number;
        location: string;
        description: string | null;
        totalDays: number;
        price: string;
        ratings: string | null;
        category: string;
        image1: string | null;
        image2: string | null;
        image3: string | null;
        createdAt: Date | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
