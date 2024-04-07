import { Module } from '@nestjs/common'
import * as Joi from 'joi'
import { AuthModule } from '@app/common/auth/auth.module'
import { KeycloakConfigService } from '@app/common/auth/auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { configuration } from '@app/common/config'
import { CardlistModule } from './app/cardlist/cardlist.module'
import { CardModule } from './app/card/card.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect'
import { ServeStaticModule } from '@nestjs/serve-static'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
const EnvSchema = {
  PORT: Joi.number(),
  DB_CONN_STR: Joi.string().required(),
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
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
      serveRoot: '/api/cardlist/swagger',
      exclude: ['/api/cardlist/swagger/index.html'],
    }),
    MongooseModule.forRoot(process.env.DB_CONN_STR || ''),
    CardlistModule,
    CardModule,
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
export class CardlistServiceModule {}
