import { InjectController, InjectRoute } from '@app/common/decorators'
import { ZodValidationPipe } from '@app/common/pipes'
import { Body, InternalServerErrorException, NotFoundException, Query, RequestMethod } from '@nestjs/common'
import { TrelloApi } from '@trello-v2/shared'

import { CardRoutes } from '../card.routes'
import { CardService } from '../services/card.service'
import { UserInfoDto } from '@app/common/auth/user-info.dto'
import { AuthenticatedUser, Public } from 'nest-keycloak-connect'

@InjectController({
  name: '/api/card',
})
export class CardController {
  constructor(private cardService: CardService) {}

  @InjectRoute(CardRoutes.createCard)
  async createCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.CreateCardRequestSchema))
    body: TrelloApi.CardApi.CreateCardRequest,
  ): Promise<TrelloApi.CardApi.CreateCardRespond> {
    const cardData = await this.cardService.createCard(body, user.email)
    if (!cardData || !cardData._id) throw new InternalServerErrorException("Can't create card")
    return {
      data: {
        ...cardData,
        _id: cardData._id,
      },
    }
  }

  @InjectRoute(CardRoutes.getAllCardsOfCardlist)
  async getAllCardsOfCardlist(
    @Query(new ZodValidationPipe(TrelloApi.CardApi.GetAllCardsOfCardlistRequestSchema))
    query: TrelloApi.CardApi.GetCardsOfCardlistRequest,
  ): Promise<TrelloApi.CardApi.GetAllCardsOfCardlistResponse> {
    const cardlist = await this.cardService.getAllCardsOfCardlist(query)
    if (!cardlist) throw new InternalServerErrorException("Can't find cards")

    const cards = cardlist.cards.reduce(
      (acum, value) => {
        if (value._id) {
          acum.push({
            ...value,
            _id: value._id,
          })
        }
        return acum
      },
      [] as TrelloApi.CardApi.GetAllCardsOfCardlistResponse['data']['cards'],
    )

    return {
      data: {
        ...cardlist,
        cards: cards,
      },
    }
  }

  @InjectRoute(CardRoutes.getCardDetail)
  async getCardDetail(
    @Query(new ZodValidationPipe(TrelloApi.CardApi.GetCardDetailRequestSchema))
    query: TrelloApi.CardApi.GetCardDetailRequest,
  ): Promise<TrelloApi.CardApi.GetCardDetailResponse> {
    const card = await this.cardService.getCardDetail(query)
    if (!card?._id) throw new NotFoundException("Can't find card id")
    return {
      data: { ...card, _id: card._id },
    }
  }

  @InjectRoute(CardRoutes.updateCardDetail)
  async updateCardDetail(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.UpdateCardDetailRequestSchema))
    body: TrelloApi.CardApi.UpdateCardDetailRequest,
  ): Promise<TrelloApi.CardApi.UpdateCardDetailResponse> {
    const card = await this.cardService.updateCardDetail(body, user.email)
    if (!card) throw new NotFoundException("Can't find card")

    return {
      data: {
        ...card,
        _id: body.card_id,
      },
    }
  }

  @InjectRoute(CardRoutes.addFeatureToCard)
  async addFeatureToCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.AddCardFeatureRequestSchema))
    body: TrelloApi.CardApi.AddCardFeatureRequest,
  ): Promise<TrelloApi.CardApi.AddCardFeatureResponse> {
    const feature = await this.cardService.addFeatureToCard(body, user.email)
    if (!feature || !feature._id) throw new InternalServerErrorException("Can't add feature")

    return {
      data: {
        ...feature,
        _id: feature._id,
      },
    }
  }

  @InjectRoute(CardRoutes.updateFeatureToCard)
  async updateFeatureToCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.UpdateCardFeatureRequestSchema))
    body: TrelloApi.CardApi.UpdateCardFeatureRequest,
  ): Promise<TrelloApi.CardApi.UpdateCardFeatureResponse> {
    const feature = await this.cardService.updateFeatureOfCard(body, user.email)
    if (!feature || !feature._id) throw new InternalServerErrorException("Can't update card feature")
    return {
      data: {
        ...feature,
        _id: feature._id,
      },
    }
  }

  @InjectRoute(CardRoutes.addWatcherToCard)
  async addWatcherToCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.AddWatcherToCardRequestSchema))
    body: TrelloApi.CardApi.AddWatcherToCardRequest,
  ): Promise<TrelloApi.CardApi.AddWatcherToCardResponse> {
    const card = await this.cardService.addWatcherToCard(body, user.email)
    if (!card || !card._id) throw new InternalServerErrorException("Can't add watcher to card")

    return {
      data: {
        ...card,
        _id: card._id,
      },
    }
  }

  @InjectRoute(CardRoutes.deleteWatcherToCard)
  async deleteWatcherToCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.DeleteWatcherToCardRequestSchema))
    body: TrelloApi.CardApi.DeleteWatcherToCardRequest,
  ): Promise<TrelloApi.CardApi.DeleteWatcherToCardResponse> {
    const card = await this.cardService.deleteWatcherFromCard(body, user.email)
    if (!card || !card._id) throw new InternalServerErrorException("Can't add watcher to card")

    return {
      data: {
        ...card,
        _id: card._id,
      },
    }
  }

  @InjectRoute(CardRoutes.archiveCard)
  async archiveCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.ArchiveCardRequestSchema))
    body: TrelloApi.CardApi.ArchiveCardRequest,
  ): Promise<TrelloApi.CardApi.ArchiveCardResponse> {
    const card = await this.cardService.archiveCard(body, user.email)
    if (!card || !card._id) throw new InternalServerErrorException("Can't archive card")
    return {
      data: {
        ...card,
        _id: card._id,
      },
    }
  }

  @InjectRoute(CardRoutes.unarchiveCard)
  async unArchiveCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.UnArchiveCardRequestSchema))
    body: TrelloApi.CardApi.ArchiveCardRequest,
  ): Promise<TrelloApi.CardApi.UnArchiveCardResponse> {
    const card = await this.cardService.unArchiveCard(body, user.email)
    if (!card || !card._id) throw new InternalServerErrorException("Can't unarchive card")
    return {
      data: {
        ...card,
        _id: card._id,
      },
    }
  }

  @InjectRoute(CardRoutes.moveCard)
  async moveCardSamelist(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.MoveCardSamelistRequestSchema))
    body: TrelloApi.CardApi.MoveCardSamelistRequest,
  ): Promise<TrelloApi.CardApi.MoveCardSamelistResponse> {
    const cards = await this.cardService.moveCardSamelist(body)
    if (!cards) throw new InternalServerErrorException("Can't move card")
    return {
      data: cards,
    }
  }

  @InjectRoute(CardRoutes.moveCardNew)
  async moveCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.MoveCardRequestSchema)) data: TrelloApi.CardApi.MoveCardRequest,
  ): Promise<TrelloApi.CardApi.MoveCardSamelistResponse> {
    return {
      data: await this.cardService.moveCard(data),
    }
  }

  @InjectRoute(CardRoutes.deleteFeatureToCard)
  async deleteFeature(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.DeleteFeatureRequestSchema)) body: TrelloApi.CardApi.DeleteFeatureRequest,
  ): Promise<TrelloApi.CardApi.DeleteFeatureResponse> {
    const card = await this.cardService.deleteFeature(body, user.email)
    return {
      data: card,
    }
  }

  @InjectRoute(CardRoutes.addMemberToCard)
  async addMemberToCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.AddCardMemberRequestSchema)) body: TrelloApi.CardApi.AddCardMemberRequest,
  ): Promise<TrelloApi.CardApi.AddCardMemberResponse> {
    const data = await this.cardService.addMemberToCard(user.email, body)
    if (!data || !data._id) throw new NotFoundException('Card not found')
    return {
      _id: data._id,
      ...data,
    }
  }

  @InjectRoute(CardRoutes.deleteMemberToCard)
  async deleteMemberToCard(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.DeleteCardMemberRequestSchema)) body: TrelloApi.CardApi.DeleteCardMemberRequest,
  ): Promise<TrelloApi.CardApi.AddCardMemberResponse> {
    const data = await this.cardService.deleteMemberToCard(body)
    if (!data || !data._id) throw new NotFoundException('Card not found')
    return {
      _id: data._id,
      ...data,
    }
  }

  @InjectRoute(CardRoutes.makeComment)
  async makeComment(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.CardApi.MakeCommentSchemaRequestSchema)) body: TrelloApi.CardApi.MakeCommentRequest,
  ): Promise<TrelloApi.CardApi.MakeCommentResponse> {
    const card = await this.cardService.commentCard(body, user.email)
    return {
      data: card,
    }
  }

  @Public()
  @InjectRoute({ method: RequestMethod.GET, path: 'test/demo' })
  demo() {
    return { Hello: 'demo' }
  }
}
