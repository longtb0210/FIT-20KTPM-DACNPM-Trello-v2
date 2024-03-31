import * as Joi from 'joi'
import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect'

import { configuration } from '@app/common'
import { AuthModule } from '@app/common/auth/auth.module'
import { KeycloakConfigService } from '@app/common/auth/auth.service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'

import { WorkspaceModule } from './app/workspace/workspace.module'

const EnvSchema = {
  PORT: Joi.number(),
  DB_CONN_STR: Joi.string().required(),
  KEYCLOAK_AUTH_SERVER_URL: Joi.string().required(),
  KEYCLOAK_CLIENT_ID: Joi.string().required(),
  KEYCLOAK_REALM: Joi.string().required(),
  KEYCLOAK_CLIENT_SECRET: Joi.string().required(),
}

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object().keys(EnvSchema),
      load: [configuration],
    }),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [AuthModule],
    }),
    ServeStaticModule.forRoot({
      rootPath: './public',
      serveRoot: '/api/workspace/swagger',
      exclude: ['/api/workspace/swagger/index.html'],
    }),
    MongooseModule.forRoot(process.env.DB_CONN_STR || ''),
    WorkspaceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class WorkspaceServiceModule {}
