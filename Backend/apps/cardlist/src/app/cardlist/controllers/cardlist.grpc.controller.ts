import { ValidateGrpcInput } from '@app/common'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { TrelloApi } from '@trello-v2/shared'
import { CardlistService } from '../services/cardlist.service'

@Controller()
export class CardlistGrpcController {
  constructor(private cardlistService: CardlistService) {}

  @GrpcMethod('CardlistService', 'cloneCardlist')
  async cloneCardlistsFromBoard(
    @ValidateGrpcInput(TrelloApi.CardlistApi.CloneCardlistsToNewBoardRequestSchema.safeParse)
    data: TrelloApi.CardlistApi.CloneCardlistsToNewBoardRequest,
  ) {
    await this.cardlistService.cloneCardlistsToNewBoard(data.board_input_id, data.board_output_id)
    return {
      is_success: true,
    }
  }
  @GrpcMethod('CardlistService', 'deleteCardlist')
  async deleteCardlist(
    @ValidateGrpcInput(TrelloApi.CardlistApi.DeleteCardlistsByBoardIdRequestSchema.safeParse)
    data: TrelloApi.CardlistApi.DeleteCardlistsByBoardIdRequest,
  ) {
    await this.cardlistService.deleteCardlistsByBoardId(data)
    return {
      is_success: true,
    }
  }
}
