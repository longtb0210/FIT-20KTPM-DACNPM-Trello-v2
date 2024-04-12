import { ActivityMModule, UserMModule } from '@app/common/database/modules'
import { Module } from '@nestjs/common'

import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { readdirSync } from 'fs'
import { join } from 'path'
import { UserGrpcService } from './services/user.grpc.service'
import { CacheService } from '@app/common/cache'
import { KcAdminService } from './services/kc.service'

const grpcPaths = readdirSync('./protos/test')
  .filter((n) => n.includes('.proto'))
  .map((n) => join(process.cwd(), 'protos', 'test', n))
console.log(grpcPaths)

@Module({
  imports: [
    UserMModule,
    ActivityMModule,
    ClientsModule.register([
      {
        name: 'ECHO_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:3334',
          package: ['trello.test'],
          protoPath: grpcPaths,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserGrpcService, CacheService.TrelloCacheDbService, KcAdminService],
})
export class UserModule {}
