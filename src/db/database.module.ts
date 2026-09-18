import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new pg.Pool({
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DRIZZLE'],
})
export class DatabaseModule {}
