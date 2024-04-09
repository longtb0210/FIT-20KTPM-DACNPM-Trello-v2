import { Module } from '@nestjs/common'
import { CardlistController } from './controllers/cardlist.controller'
import { CardlistService } from './services/cardlist.service'
import { BoardMModule, CardMModule, CardlistMModule } from '@app/common/database/modules'
import { CardlistGrpcController } from './controllers/cardlist.grpc.controller'

@Module({
  imports: [CardlistMModule, BoardMModule, CardMModule],
  controllers: [CardlistController, CardlistGrpcController],
  providers: [CardlistService],
})
export class CardlistModule {}
