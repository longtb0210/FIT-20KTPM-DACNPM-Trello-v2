import { InjectController, InjectRoute } from '@app/common/decorators'
// import { SwaggerApi } from '@app/common/decorators/swagger.decorator'
// import { getSchemaPath } from '@nestjs/swagger'
import { IdParamValidationPipe, ZodValidationPipe } from '@app/common/pipes'
import { Body, Param } from '@nestjs/common'
import { TrelloApi } from '@trello-v2/shared'

import { CardlistRoutes } from '../cardlist.routes'
import { CardlistService } from '../services/cardlist.service'
import { AuthenticatedUser, Public } from 'nest-keycloak-connect'
import { UserInfoDto } from '@app/common/auth/user-info.dto'

@InjectController({
  name: CardlistRoutes.index,
})
export class CardlistController {
  constructor(private cardlistService: CardlistService) {}

  @InjectRoute(CardlistRoutes.getAllCardlistApi)
  @Public(false)
  async getAll(): Promise<TrelloApi.CardlistApi.GetallCardlistResponse> {
    const data = await this.cardlistService.getAllCardlist()
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.createCardlistApi)
  async create(
    @Body(new ZodValidationPipe(TrelloApi.CardlistApi.CreateCardlistRequestSchema))
    body: TrelloApi.CardlistApi.CreateCardlistRequest,
    @AuthenticatedUser() user: UserInfoDto,
  ): Promise<TrelloApi.CardlistApi.CreateCardlistResponse> {
    body.watcher_email = [user.email]
    const data = await this.cardlistService.createCardlist(body)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.copyCardlistApi)
  @Public(false)
  async copy(
    @Body(new ZodValidationPipe(TrelloApi.CardlistApi.CopyCardlistRequestSchema))
    body: TrelloApi.CardlistApi.CopyCardlistRequest,
    @AuthenticatedUser() user: UserInfoDto,
  ): Promise<TrelloApi.CardlistApi.CopyCardlistResponse> {
    body.created_by = user.email
    const data = await this.cardlistService.copyCardlist(body)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.getCardlistsByBoardId)
  @Public(false)
  async getAllByBoardId(
    @Param('boardId', IdParamValidationPipe) boardId: string,
  ): Promise<TrelloApi.CardlistApi.GetallCardlistByBoardIdResponse> {
    const data = await this.cardlistService.getAllCardlistByBoardId(boardId)
    return {
      data: data,
    }
  }
  @InjectRoute(CardlistRoutes.getCardlistsArchivedByBoardId)
  @Public(false)
  async getAllArchivedByBoardId(
    @Param('boardId', IdParamValidationPipe) boardId: string,
  ): Promise<TrelloApi.CardlistApi.GetallCardlistArchivedByBoardIdResponse> {
    const data = await this.cardlistService.getAllCardlistArchivedByBoardId(boardId)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.getCardlistsNonArchivedByBoardId)
  @Public(false)
  async getAllNonArchivedByBoardId(
    @Param('boardId', IdParamValidationPipe) boardId: string,
  ): Promise<TrelloApi.CardlistApi.GetallCardlistNonArchivedByBoardIdResponse> {
    const data = await this.cardlistService.getAllCardlistNonArchivedByBoardId(boardId)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.sortCardlistsByOldestDate)
  @Public(false)
  async sortByOldestDate(
    @Param('boardId', IdParamValidationPipe) boardId: string,
  ): Promise<TrelloApi.CardlistApi.SortCardlistByOldestDateResponse> {
    const data = await this.cardlistService.sortCardlistByOldestDate(boardId)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.sortCardlistsByNewestDate)
  @Public(false)
  async sortByNewestDate(
    @Param('boardId', IdParamValidationPipe) boardId: string,
  ): Promise<TrelloApi.CardlistApi.SortCardlistByNewestDateResponse> {
    const data = await this.cardlistService.sortCardlistByNewestDate(boardId)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.sortCardlistsByName)
  @Public(false)
  async sortByName(@Param('boardId', IdParamValidationPipe) boardId: string): Promise<TrelloApi.CardlistApi.SortCardlistByNameResponse> {
    const data = await this.cardlistService.sortCardlistByName(boardId)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.updateCardlists)
  @Public(false)
  async update(
    @Body(new ZodValidationPipe(TrelloApi.CardlistApi.UpdateCardlistRequestSchema))
    body: TrelloApi.CardlistApi.UpdateCardlistRequest,
  ): Promise<TrelloApi.CardlistApi.UpdateCardlistResponse> {
    const data = await this.cardlistService.updateCardlist(body)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.moveCardlists)
  @Public(false)
  async move(
    @Body(new ZodValidationPipe(TrelloApi.CardlistApi.MoveCardlistRequestSchema))
    body: TrelloApi.CardlistApi.MoveCardlistRequest,
  ): Promise<TrelloApi.CardlistApi.MoveCardlistResponse> {
    const data = await this.cardlistService.moveCardlist(body)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.archiveCardsInList)
  @Public(false)
  async archiveCardsInList(
    @Param('cardlistId', IdParamValidationPipe) cardlistId: string,
  ): Promise<TrelloApi.CardlistApi.ArchiveAllCardsInListResponse> {
    const data = await this.cardlistService.archiveCardsInlist(cardlistId)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.archiveCardList)
  @Public(false)
  async archiveCardList(
    @Param('cardlistId', IdParamValidationPipe) cardlistId: string,
  ): Promise<TrelloApi.CardlistApi.ArchiveCardlistResponse> {
    const data = await this.cardlistService.archiveCardlist(cardlistId)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.addWatcher)
  @Public(false)
  async addWatcher(
    @Body(new ZodValidationPipe(TrelloApi.CardlistApi.AddWatcherRequestSchema))
    body: TrelloApi.CardlistApi.AddWatcherRequest,
  ): Promise<TrelloApi.CardlistApi.AddWatcherResponse> {
    const data = await this.cardlistService.addWatcher(body)
    return {
      data: data,
    }
  }
  @InjectRoute(CardlistRoutes.addCardTolist)
  @Public(false)
  async addCardToList(
    @Body(new ZodValidationPipe(TrelloApi.CardlistApi.AddCardToListRequestSchema))
    body: TrelloApi.CardlistApi.AddCardToListRequest,
  ): Promise<TrelloApi.CardlistApi.AddCardToListResponse> {
    const data = await this.cardlistService.addCardToList(body)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.cloneCardlists)
  async cloneCardlistsByBoard(
    @Body(new ZodValidationPipe(TrelloApi.CardlistApi.CloneCardlistsToNewBoardRequestSchema))
    body: TrelloApi.CardlistApi.CloneCardlistsToNewBoardRequest,
  ): Promise<TrelloApi.CardlistApi.CloneCardlistsToNewBoardResponse> {
    const data = await this.cardlistService.cloneCardlistsToNewBoard(body.board_input_id, body.board_output_id)
    return {
      data: data,
    }
  }

  @InjectRoute(CardlistRoutes.deleteCardlistsByBoardId)
  async deleteCardlistsByBoardId(
    @Body(new ZodValidationPipe(TrelloApi.CardlistApi.DeleteCardlistsByBoardIdRequestSchema))
    body: TrelloApi.CardlistApi.DeleteCardlistsByBoardIdRequest,
  ) {
    const result = await this.cardlistService.deleteCardlistsByBoardId(body)
    return {
      result: result,
    }
  }
}
