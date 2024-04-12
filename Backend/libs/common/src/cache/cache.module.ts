import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import knex from 'knex'
import { join } from 'path'
import { TrelloCacheDbService } from './cache.service'
const CACHE_MODULE = 'TRELLO_SQLITE_CACHE_MODULE' as const
export interface TrelloCacheDbModuleOptions {
  sqlite_path?: string
}

@Global()
@Module({})
export class TrelloCacheDbModule {
  static async forRoot(options: TrelloCacheDbModuleOptions): Promise<DynamicModule> {
    const knexClient = knex({
      client: 'better-sqlite3',
      connection: {
        filename: options.sqlite_path || join(process.cwd(), 'db', 'Cache.db'),
      },
      useNullAsDefault: true,
    })
    await knexClient.schema.createTableIfNotExists('cache_table', function (table) {
      table.string('id').primary()
      table.string('json_data', 6072)
      table.integer('create_stamp').defaultTo(0)
    })

    const knexProvider: Provider = {
      provide: CACHE_MODULE,
      useValue: knexClient,
    }
    return {
      module: TrelloCacheDbModule,
      providers: [knexProvider, TrelloCacheDbService],
      exports: [knexProvider, TrelloCacheDbService],
    }
  }
}
