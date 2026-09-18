import { ResortsService } from './resorts.service.js';
export declare class ResortsController {
    private readonly resortsService;
    constructor(resortsService: ResortsService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
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
    create(files: Express.Multer.File[], body: {
        location: string;
        description?: string;
        price: string;
        ratings?: string;
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
    update(id: number, body: {
        location?: string;
        description?: string;
        price?: number;
        ratings?: number;
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
    remove(id: number): Promise<{
        message: string;
    }>;
}
