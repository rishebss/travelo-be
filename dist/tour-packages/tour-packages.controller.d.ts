import { TourPackagesService } from './tour-packages.service.js';
export declare class TourPackagesController {
    private readonly tourPackagesService;
    constructor(tourPackagesService: TourPackagesService);
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
    create(files: Express.Multer.File[], body: {
        location: string;
        description?: string;
        totalDays: string;
        price: string;
        ratings?: string;
        category: string;
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
    update(id: number, body: {
        location?: string;
        description?: string;
        totalDays?: number;
        price?: number;
        ratings?: number;
        category?: string;
    }): Promise<{
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
