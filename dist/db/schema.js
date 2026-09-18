import { pgSchema, serial, text, integer, numeric, timestamp, } from 'drizzle-orm/pg-core';
export const appSchema = pgSchema('app');
export const resorts = appSchema.table('resorts', {
    id: serial('id').primaryKey(),
    location: text('location').notNull(),
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
    ratings: numeric('ratings', { precision: 3, scale: 1 }).default('0'),
    image1: text('image1'),
    image2: text('image2'),
    image3: text('image3'),
    createdAt: timestamp('created_at').defaultNow(),
});
export const tourPackages = appSchema.table('tour_packages', {
    id: serial('id').primaryKey(),
    location: text('location').notNull(),
    description: text('description'),
    totalDays: integer('total_days').notNull().default(1),
    price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
    ratings: numeric('ratings', { precision: 3, scale: 1 }).default('0'),
    category: text('category').notNull().default('Kerala'),
    image1: text('image1'),
    image2: text('image2'),
    image3: text('image3'),
    createdAt: timestamp('created_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map