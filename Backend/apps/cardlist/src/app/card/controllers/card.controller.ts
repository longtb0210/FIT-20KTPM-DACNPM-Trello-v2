import { InjectController, InjectRoute, SwaggerApi } from '@app/common/decorators'
import { ZodValidationPipe } from '@app/common/pipes'
import { Body, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'
import { TrelloApi } from '@trello-v2/shared'

import { CardRoutes } from '../card.routes'
import { CardService } from '../services/card.service'

@InjectController({
  name: '/api/card',
})
export class CardController {
  constructor(private cardService: CardService) {}

  @InjectRoute(CardRoutes.createCard)
  @SwaggerApi({
    secure: false,
    body: {
      schema: { $ref: getSchemaPath('CreateCardRequestSchema') },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('CreateCardRespondSchema') },
      },
    ],
  })
  async createCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.CreateCardRequestSchema))
    body: TrelloApi.CardApi.CreateCardRequest,
  ): Promise<TrelloApi.CardApi.CreateCardRespond> {
    const cardData = await this.cardService.createCard(body)
    if (!cardData || !cardData._id) throw new InternalServerErrorException("Can't create card")
    return {
      data: {
        ...cardData,
        _id: cardData._id,
      },
    }
  }

  @InjectRoute(CardRoutes.getAllCardsOfCardlist)
  @SwaggerApi({
    secure: false,
    query: {
      name: 'query',
      schema: { $ref: getSchemaPath('GetAllCardsOfCardlistRequestSchema') },
      style: 'form',
      explode: true,
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetAllCardsOfCardlistResponseSchema') },
      },
    ],
  })
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
  @SwaggerApi({
    query: {
      name: 'query',
      schema: { $ref: getSchemaPath('GetCardDetailRequestSchema') },
      style: 'form',
      explode: true,
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetCardDetailResponseSchema') },
      },
    ],
  })
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
  @SwaggerApi({
    secure: false,
    body: { schema: { $ref: getSchemaPath('UpdateCardDetailRequestSchema') } },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('UpdateCardDetailResponseSchema') },
      },
    ],
  })
  async updateCardDetail(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.UpdateCardDetailRequestSchema))
    body: TrelloApi.CardApi.UpdateCardDetailRequest,
  ): Promise<TrelloApi.CardApi.UpdateCardDetailResponse> {
    const card = await this.cardService.updateCardDetail(body)
    if (!card) throw new NotFoundException("Can't find card")

    return {
      data: {
        ...card,
        _id: body.card_id,
      },
    }
  }

  @InjectRoute(CardRoutes.addFeatureToCard)
  @SwaggerApi({
    secure: false,
    body: { schema: { $ref: getSchemaPath('AddCardFeatureRequestSchema') } },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('AddCardFeatureResponseSchema') },
      },
    ],
  })
  async addFeatureToCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.AddCardFeatureRequestSchema))
    body: TrelloApi.CardApi.AddCardFeatureRequest,
  ): Promise<TrelloApi.CardApi.AddCardFeatureResponse> {
    const feature = await this.cardService.addFeatureToCard(body)
    if (!feature || !feature._id) throw new InternalServerErrorException("Can't add feature")

    return {
      data: {
        ...feature,
        _id: feature._id,
      },
    }
  }

  @InjectRoute(CardRoutes.updateFeatureToCard)
  @SwaggerApi({
    secure: false,
    body: { schema: { $ref: getSchemaPath('UpdateCardFeatureRequestSchema') } },
    responses: [{ status: 200, schema: { $ref: getSchemaPath('') } }],
  })
  async updateFeatureToCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.UpdateCardFeatureRequestSchema))
    body: TrelloApi.CardApi.UpdateCardFeatureRequest,
  ): Promise<TrelloApi.CardApi.UpdateCardFeatureResponse> {
    const feature = await this.cardService.updateFeatureOfCard(body)
    if (!feature || !feature._id) throw new InternalServerErrorException("Can't update card feature")
    return {
      data: {
        ...feature,
        _id: feature._id,
      },
    }
  }

  @InjectRoute(CardRoutes.addWatcherToCard)
  @SwaggerApi({
    secure: false,
    body: { schema: { $ref: getSchemaPath('AddWatcherToCardRequestSchema') } },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('AddWatcherToCardResponseSchema') },
      },
    ],
  })
  async addWatcherToCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.AddWatcherToCardRequestSchema))
    body: TrelloApi.CardApi.AddWatcherToCardRequest,
  ): Promise<TrelloApi.CardApi.AddWatcherToCardResponse> {
    const card = await this.cardService.addWatcherToCard(body)
    if (!card || !card._id) throw new InternalServerErrorException("Can't add watcher to card")

    return {
      data: {
        ...card,
        _id: card._id,
      },
    }
  }

  @InjectRoute(CardRoutes.deleteWatcherToCard)
  @SwaggerApi({
    secure: false,
    body: {
      schema: { $ref: getSchemaPath('DeleteWatcherToCardRequestSchema') },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('DeleteWatcherToCardResponseSchema') },
      },
    ],
  })
  async deleteWatcherToCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.DeleteWatcherToCardRequestSchema))
    body: TrelloApi.CardApi.DeleteWatcherToCardRequest,
  ): Promise<TrelloApi.CardApi.DeleteWatcherToCardResponse> {
    const card = await this.cardService.deleteWatcherFromCard(body)
    if (!card || !card._id) throw new InternalServerErrorException("Can't add watcher to card")

    return {
      data: {
        ...card,
        _id: card._id,
      },
    }
  }

  @InjectRoute(CardRoutes.archiveCard)
  @SwaggerApi({
    body: { schema: { $ref: getSchemaPath('ArchiveCardRequestSchema') } },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('ArchiveCardResponseSchema') },
      },
    ],
  })
  async archiveCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.ArchiveCardRequestSchema))
    body: TrelloApi.CardApi.ArchiveCardRequest,
  ): Promise<TrelloApi.CardApi.ArchiveCardResponse> {
    const card = await this.cardService.archiveCard(body)
    if (!card || !card._id) throw new InternalServerErrorException("Can't archive card")
    return {
      data: {
        ...card,
        _id: card._id,
      },
    }
  }

  @InjectRoute(CardRoutes.unarchiveCard)
  @SwaggerApi({
    body: { schema: { $ref: getSchemaPath('UnArchiveCardRequestSchema') } },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('UnArchiveCardResponseSchema') },
      },
    ],
  })
  async unArchiveCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.UnArchiveCardRequestSchema))
    body: TrelloApi.CardApi.ArchiveCardRequest,
  ): Promise<TrelloApi.CardApi.UnArchiveCardResponse> {
    const card = await this.cardService.unArchiveCard(body)
    if (!card || !card._id) throw new InternalServerErrorException("Can't unarchive card")
    return {
      data: {
        ...card,
        _id: card._id,
      },
    }
  }

  @InjectRoute(CardRoutes.moveCard)
  @SwaggerApi({
    body: { schema: { $ref: getSchemaPath('MoveCardSamelistRequestSchema') } },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('MoveCardSamelistResponseSchema') },
      },
    ],
  })
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
  @SwaggerApi({
    body: {
      schema: { $ref: getSchemaPath('MoveCardRequestSchema') },
    },
    responses: [{ status: 200, schema: { $ref: getSchemaPath('MoveCardResponseSchema') } }],
  })
  async moveCard(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.MoveCardRequestSchema)) data: TrelloApi.CardApi.MoveCardRequest,
  ): Promise<TrelloApi.CardApi.MoveCardSamelistResponse> {
    return {
      data: await this.cardService.moveCard(data),
    }
  }

  @InjectRoute(CardRoutes.deleteFeatureToCard)
  @SwaggerApi({
    body: { schema: { $ref: getSchemaPath('DeleteFeatureRequestSchema') } },
    responses: [{ status: 200, schema: { $ref: getSchemaPath('MoveCardResponseSchema') } }],
  })
  async deleteFeature(
    @Body(new ZodValidationPipe(TrelloApi.CardApi.DeleteFeatureRequestSchema)) body: TrelloApi.CardApi.DeleteFeatureRequest,
  ): Promise<TrelloApi.CardApi.DeleteFeatureResponse> {
    const card = await this.cardService.deleteFeature(body)
    return {
      data: card,
    }
  }
}
