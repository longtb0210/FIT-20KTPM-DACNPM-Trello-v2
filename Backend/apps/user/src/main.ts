import { NestFactory } from '@nestjs/core'
import { UserServiceModule } from './user.module'
import { initSwagger } from '@app/common'
import { TrelloApi } from '@trello-v2/shared'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  // const PORT = 4000
  console.log(process.env.DB_CONN_STR)
  const app = await NestFactory.create(UserServiceModule)
  initSwagger(app, 'api/user/swagger', [TrelloApi.UserApi])
  await app.startAllMicroservices()
  await app.listen(PORT, () => console.log(`User server http://localhost:${PORT}`))
}
bootstrap()
