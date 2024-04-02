import { readdirSync } from 'fs'
import { join } from 'path'

import { initProtos, initSwagger } from '@app/common'
import { NestFactory } from '@nestjs/core'
import { TrelloApi } from '@trello-v2/shared'

import { WorkspaceServiceModule } from './workspace.module'

async function bootstrap() {
  const PORT = process.env.PORT || '3000'
  const GRPC_HOST = process.env.GRPC_HOST || 'localhost'
  const GRPC_PORT = parseInt(PORT) + 1
  const app = await NestFactory.create(WorkspaceServiceModule)
  initSwagger(app, 'api/workspace/swagger', [TrelloApi.WorkspaceApi])

  const grpcPaths = readdirSync('./protos/workspace')
    .filter((n) => n.includes('.proto'))
    .concat(readdirSync('./protos/').filter((n) => n.includes('.proto')))
    .map((n) => join(process.cwd(), 'protos', 'workspace', n))

  initProtos(app, `${GRPC_HOST}:${GRPC_PORT}`, grpcPaths, ['trello.workspace', 'trello.auth'])

  await app.startAllMicroservices()
  await app.listen(PORT, () => console.log(`workspace server http://localhost:${PORT}`))
}
bootstrap()
