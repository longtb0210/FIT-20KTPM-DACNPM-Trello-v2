import { Module } from '@nestjs/common'
import { BoardModule } from './app/board/board.module'
import * as Joi from 'joi'
import { ConfigModule } from '@nestjs/config'
import { configuration } from '@app/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from '@app/common/auth/auth.module'
import { KeycloakConfigService } from '@app/common/auth/auth.service'
import { ServeStaticModule } from '@nestjs/serve-static'

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
      serveRoot: '/api/board/swagger',
      exclude: ['/api/board/swagger/index.html'],
    }),
    MongooseModule.forRoot(process.env.DB_CONN_STR || ''),
    BoardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class BoardServiceModule {}
