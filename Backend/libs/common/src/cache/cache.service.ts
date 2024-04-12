import { Inject, Injectable } from '@nestjs/common'
import knex from 'knex'
const CACHE_MODULE = 'TRELLO_SQLITE_CACHE_MODULE' as const
const table_name = 'cache_table'

export interface CacheTableSchema {
  id: string
  json_data: string
  create_stamp: number
}

@Injectable()
export class TrelloCacheDbService {
  constructor(@Inject(CACHE_MODULE) private knexClient: knex.Knex) {}

  async getDataByKeyId(keyId: string) {
    const data = await this.knexClient<CacheTableSchema>(table_name).where('id', keyId).first()
    return data as CacheTableSchema | undefined
  }
  async insertOrUpdate(keyId: string, data: object) {
    const exist = await this.getDataByKeyId(keyId)
    if (!exist) {
      return await this.addDataWithKey(keyId, data)
    }
    return (
      await this.knexClient<CacheTableSchema>(table_name)
        .where('id', '=', keyId)
        .update({ json_data: JSON.stringify(data), create_stamp: new Date().getTime() })
        .returning('*')
    )[0]
  }
  async addDataWithKey(keyId: string, data: object) {
    return (
      await this.knexClient<CacheTableSchema>(table_name)
        .insert({
          id: keyId,
          json_data: JSON.stringify(data),
          create_stamp: new Date().getTime(),
        })
        .returning('*')
    )[0] as CacheTableSchema
  }
}
