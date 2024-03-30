import * as Joi from 'joi'
import { ZodType } from 'zod'

import { configuration } from '@app/common/config'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'
import { TrelloApi } from '@trello-v2/shared'

import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { BoardModule } from './board/board.module'
import { CardModule } from './card/card.module'
import { CardlistModule } from './cardlist/cardlist.module'
import { TestController } from './test/test.controller'
import { UserModule } from './user/user.module'
import { WorkspaceModule } from './workspace/workspace.module'

const EnvSchema = {
  PORT: Joi.number(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  DB_CONN_STR: Joi.string().required(),
}

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object().keys(EnvSchema),
    }),
    MongooseModule.forRoot(process.env.DB_CONN_STR || ''),
    CardlistModule,
    WorkspaceModule,
    UserModule,
    BoardModule,
    CardModule,
    AuthModule,
  ],
  controllers: [AppController, TestController],
  providers: [],
})
export class AppModule {}

type MSModuleType = {
  name: string
  module: any
  schema: { [key: string]: ZodType }
}

function GenerateMSModule(...modules: any[]) {
  @Module({
    imports: [
      ConfigModule.forRoot({
        validationSchema: Joi.object().keys(EnvSchema),
        load: [configuration],
      }),
      MongooseModule.forRoot('mongodb://MONGO_USER:MONGO_123@localhost:7000/trello?authSource=admin'),
      ...modules,
    ],
  })
  class MS {}
  return MS
}

export const MS_MODULES: MSModuleType[] = [
  { name: 'Card module', module: GenerateMSModule(CardModule), schema: TrelloApi.CardApi },
  { name: 'Cardlist module', module: GenerateMSModule(CardlistModule), schema: TrelloApi.CardlistApi },
  { name: 'User module', module: GenerateMSModule(UserModule), schema: TrelloApi.UserApi },
  { name: 'Workspace module', module: GenerateMSModule(WorkspaceModule), schema: TrelloApi.WorkspaceApi },
  { name: 'Board module', module: GenerateMSModule(BoardModule), schema: TrelloApi.BoardApi },
]
