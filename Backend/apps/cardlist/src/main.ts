import { NestFactory } from '@nestjs/core'
import { CardlistServiceModule } from './cardlist.module'
import { join, resolve } from 'path'
import { readdirSync } from 'fs'
import { TrelloApi, DbSchemas } from '@trello-v2/shared'

import 'dotenv/config'
import { initProtos, initSwagger } from '@app/common'

import { z } from 'zod'

export default async function bootstrap() {
  const GRPC_HOST = process.env.GRPC_HOST || 'localhost'
  const PORT = process.env.PORT || '3000'
  const GRPC_PORT = parseInt(PORT) + 1
  console.log(process.env.DB_CONN_STR)
  const app = await NestFactory.create(CardlistServiceModule)
  initSwagger(app, 'api/cardlist/swagger', [TrelloApi.CardlistApi, TrelloApi.CardApi])

  const grpcPaths = readdirSync('./protos/cardlist')
    .filter((n) => n.includes('.proto'))
    .map((n) => join(process.cwd(), 'protos', 'cardlist', n))
  console.log(grpcPaths)
  initProtos(app, `${GRPC_HOST}:${GRPC_PORT}`, grpcPaths, ['trello.cardlist'])

  await app.startAllMicroservices()
  await app.listen(PORT, () => console.log(`Cardlist server http://localhost:${PORT}`))
}
bootstrap()
