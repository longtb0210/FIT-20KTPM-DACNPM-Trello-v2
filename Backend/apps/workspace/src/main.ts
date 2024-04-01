import { initSwagger } from '@app/common'
import { NestFactory } from '@nestjs/core'
import { TrelloApi } from '@trello-v2/shared'

import { WorkspaceServiceModule } from './workspace.module'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(WorkspaceServiceModule)
  initSwagger(app, 'api/workspace/swagger', [TrelloApi.WorkspaceApi])
  await app.startAllMicroservices()
  await app.listen(PORT, () => console.log(`workspace server http://localhost:${PORT}`))
}
bootstrap()
