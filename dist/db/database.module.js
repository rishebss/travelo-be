var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    Global(),
    Module({
        providers: [
            {
                provide: 'DRIZZLE',
                inject: [ConfigService],
                useFactory: (config) => {
                    const pool = new pg.Pool({
                        connectionString: config.getOrThrow('DATABASE_URL'),
                    });
                    return drizzle(pool, { schema });
                },
            },
        ],
        exports: ['DRIZZLE'],
    })
], DatabaseModule);
export { DatabaseModule };
//# sourceMappingURL=database.module.js.map