# Travelo Backend — NestJS Architecture

## Overview

The backend is built with **NestJS** (v12), a progressive Node.js framework for building scalable server-side applications. It uses **Drizzle ORM** for type-safe database access to a **PostgreSQL 17** database. The API serves the Travelo frontend with resort and tour package data.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | NestJS | 12.x |
| Language | TypeScript | 6.x |
| ORM | Drizzle ORM | 0.45.x |
| Database | PostgreSQL | 17 |
| DB Driver | pg (node-postgres) | 8.x |
| Config | @nestjs/config | 12.x |
| Validation | class-validator / class-validator | Built-in |
| File Upload | Multer (via @nestjs/platform-express) | — |
| Runtime | Node.js | 24.x |

---

## Project Structure

```
backend-nest/
├── src/
│   ├── db/
│   │   ├── schema.ts              # Drizzle table definitions
│   │   └── database.module.ts     # Global database module (DI provider)
│   ├── resorts/
│   │   ├── resorts.module.ts      # Resorts feature module
│   │   ├── resorts.controller.ts  # HTTP route handlers
│   │   └── resorts.service.ts     # Business logic & DB queries
│   ├── tour-packages/
│   │   ├── tour-packages.module.ts
│   │   ├── tour-packages.controller.ts
│   │   └── tour-packages.service.ts
│   ├── app.module.ts              # Root module (wires everything)
│   ├── app.controller.ts          # Root health-check controller
│   ├── app.service.ts             # Root service
│   └── main.ts                    # Application entry point
├── uploads/                       # Static file storage (multer)
├── drizzle/                       # Auto-generated migration files
├── drizzle.config.ts              # Drizzle Kit configuration
├── docs/                          # Documentation
├── .env                           # Environment variables
├── package.json
└── tsconfig.json
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    NestJS Application                │
│                                                     │
│  ┌───────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │  Config    │  │   Database    │  │   Static    │ │
│  │  Module    │  │   Module      │  │   Assets    │ │
│  │ (.env)     │  │  (Drizzle)    │  │ (uploads/)  │ │
│  └─────┬─────┘  └──────┬───────┘  └─────────────┘ │
│        │               │                            │
│  ┌─────┴───────────────┴──────────────────────────┐ │
│  │              Root Module (AppModule)            │ │
│  │                                                 │ │
│  │  ┌──────────────┐    ┌──────────────────────┐  │ │
│  │  │ Resorts      │    │ TourPackages         │  │ │
│  │  │ Module       │    │ Module               │  │ │
│  │  │              │    │                      │  │ │
│  │  │ ┌──────────┐ │    │ ┌──────────────────┐ │  │ │
│  │  │ │Controller│ │    │ │ Controller       │ │  │ │
│  │  │ └────┬─────┘ │    │ └────┬─────────────┘ │  │ │
│  │  │      │       │    │      │               │  │ │
│  │  │ ┌────┴─────┐ │    │ ┌────┴─────────────┐ │  │ │
│  │  │ │ Service  │ │    │ │ Service          │ │  │ │
│  │  │ └────┬─────┘ │    │ └────┬─────────────┘ │  │ │
│  │  └──────┼───────┘    └──────┼───────────────┘  │ │
│  └─────────┼───────────────────┼──────────────────┘ │
│            │                   │                     │
│            ▼                   ▼                     │
│  ┌─────────────────────────────────────────────┐    │
│  │          Drizzle ORM (drizzle-orm)          │    │
│  │    Schema: resorts, tour_packages tables    │    │
│  └──────────────────┬──────────────────────────┘    │
└─────────────────────┼───────────────────────────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  PostgreSQL 17  │
             │  (filess.io)    │
             │  Schema: app    │
             └─────────────────┘
```

---

## Module Details

### 1. Database Module (`src/db/`)

**Global module** — available to all modules via dependency injection.

#### `schema.ts` — Drizzle Table Definitions

```typescript
// Resorts table
resorts {
  id          SERIAL PRIMARY KEY
  location    TEXT NOT NULL
  description TEXT
  price       NUMERIC(10,2) DEFAULT 0
  ratings     NUMERIC(3,1) DEFAULT 0
  image1      TEXT
  image2      TEXT
  image3      TEXT
  created_at  TIMESTAMP DEFAULT NOW()
}

// Tour Packages table
tour_packages {
  id          SERIAL PRIMARY KEY
  location    TEXT NOT NULL
  description TEXT
  total_days  INTEGER DEFAULT 1
  price       NUMERIC(10,2) DEFAULT 0
  ratings     NUMERIC(3,1) DEFAULT 0
  category    TEXT DEFAULT 'Kerala'   // 'Kerala' | 'International' | 'NorthEast'
  image1      TEXT
  image2      TEXT
  image3      TEXT
  created_at  TIMESTAMP DEFAULT NOW()
}
```

#### `database.module.ts`

Provides a global `DRIZZLE` token via `@Global()` decorator. Uses `ConfigService` to read `DATABASE_URL` and creates a `pg.Pool` + Drizzle instance.

```
@Inject('DRIZZLE') → NodePgDatabase<typeof schema>
```

---

### 2. Resorts Module (`src/resorts/`)

Handles all resort-related CRUD operations.

#### Controller (`resorts.controller.ts`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/resorts` | List all resorts (newest first) |
| GET | `/api/resorts/:id` | Get single resort by ID |
| POST | `/api/resorts` | Create resort (multipart: images + form data) |
| PUT | `/api/resorts/:id` | Update resort fields |
| DELETE | `/api/resorts/:id` | Delete resort |

**File Upload:** Uses `@UseInterceptors(FilesInterceptor(...))` with Multer disk storage.
- Max 5 images, 5MB each
- Accepted: JPEG, JPG, PNG
- Stored in `uploads/` directory
- URLs returned as `/uploads/{filename}`

#### Service (`resorts.service.ts`)

Injects `DRIZZLE` token. All queries use Drizzle's type-safe query builder:
- `findAll()` → `db.select().from(resorts).orderBy(desc(resorts.createdAt))`
- `findOne(id)` → `db.select().from(resorts).where(eq(resorts.id, id))`
- `create(data)` → `db.insert(resorts).values({...}).returning()`
- `update(id, data)` → `db.update(resorts).set({...}).where(eq(...)).returning()`
- `remove(id)` → `db.delete(resorts).where(eq(...)).returning()`

---

### 3. Tour Packages Module (`src/tour-packages/`)

Handles tour package CRUD with category filtering.

#### Controller (`tour-packages.controller.ts`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tour-packages` | List all packages (newest first) |
| GET | `/api/tour-packages/category/:category` | Filter by category |
| GET | `/api/tour-packages/:id` | Get single package by ID |
| POST | `/api/tour-packages` | Create package (multipart: images + form data) |
| PUT | `/api/tour-packages/:id` | Update package fields |
| DELETE | `/api/tour-packages/:id` | Delete package |

**File Upload:** Same Multer config, max 3 images.

**Category Validation:** Accepted values: `Kerala`, `International`, `NorthEast`. Throws `BadRequestException` for invalid categories.

#### Service (`tour-packages.service.ts`)

Same pattern as ResortsService. Additional:
- `findByCategory(category)` → filters by category field
- `VALID_CATEGORIES` constant enforced at service level

---

### 4. Root Module (`src/app.module.ts`)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // .env loading
    DatabaseModule,                              // Drizzle provider
    ResortsModule,                               // Resort CRUD
    TourPackagesModule,                          // Tour package CRUD
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 5. Entry Point (`src/main.ts`)

- Creates NestExpressApplication
- Enables CORS (`app.enableCors()`)
- Mounts static file serving for `/uploads`
- Listens on `PORT` env var (default: 3000)

---

## Data Flow

### Read Request (GET /api/resorts)
```
HTTP GET → ResortsController.findAll()
         → ResortsService.findAll()
         → Drizzle: SELECT * FROM app.resorts ORDER BY created_at DESC
         → PostgreSQL
         → { success: true, data: [...] }
         → JSON Response
```

### Create Request (POST /api/tour-packages)
```
HTTP POST (multipart/form-data)
         → TourPackagesController.create()
         → Multer interceptor saves images to uploads/
         → TourPackagesService.create()
         → Category validation (Kerala/International/NorthEast)
         → Drizzle: INSERT INTO app.tour_packages (...) VALUES (...) RETURNING *
         → PostgreSQL
         → Created record
         → JSON Response
```

---

## Environment Variables

| Variable | Description | Example |
|----------|------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `PORT` | Server port | `3000` |

---

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start with hot-reload (development) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run compiled output |
| `npm run start:debug` | Start with debugger attached |
| `npx drizzle-kit push` | Push schema changes to DB |
| `npx drizzle-kit generate` | Generate migration files |
| `npx drizzle-kit migrate` | Run pending migrations |

---

## Response Format

All list endpoints return data wrapped in a consistent envelope:

```json
{
  "success": true,
  "data": [ ... ]
}
```

Single-item endpoints return the raw object. Error responses use NestJS built-in exception filters (400, 404, 500).

---

## Adding New Modules

To add a new feature (e.g., bookings):

1. Create directory: `src/bookings/`
2. Create module, controller, service files
3. Add Drizzle table to `src/db/schema.ts`
4. Import module in `app.module.ts`
5. Run `npx drizzle-kit push` to sync schema

The `DRIZZLE` provider is globally available — just inject it in any service.

---

## Migration from Express.js

| Old (Express) | New (NestJS) |
|---------------|-------------|
| `controllers/resortController.js` | `src/resorts/resorts.service.ts` |
| `routes/resortRoutes.js` | `src/resorts/resorts.controller.ts` (decorators) |
| `config/supabase.js` | `src/db/database.module.ts` |
| `config/db.js` (pg pool) | Drizzle ORM via DI |
| `server.js` | `src/main.ts` |
| Raw SQL / Supabase client | Drizzle query builder |
