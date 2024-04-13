import { IRouteParams } from '@app/common/decorators'
import { RequestMethod } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'

export const CardRoutes = {
  createCard: {
    path: '',
    method: RequestMethod.POST,
    jwtSecure: false,
    swaggerInfo: {
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
    },
  } as IRouteParams,
  getAllCardsOfCardlist: {
    path: '',
    method: RequestMethod.GET,
    jwtSecure: false,
    swaggerInfo: {
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
    },
  } as IRouteParams,
  getCardDetail: {
    path: 'detail',
    method: RequestMethod.GET,
    jwtSecure: false,
    swaggerInfo: {
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
    },
  } as IRouteParams,
  updateCardDetail: {
    path: 'detail',
    method: RequestMethod.PUT,
    jwtSecure: false,
    swaggerInfo: {
      secure: false,
      body: { schema: { $ref: getSchemaPath('UpdateCardDetailRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('UpdateCardDetailResponseSchema') },
        },
      ],
    },
  } as IRouteParams,
  addFeatureToCard: {
    path: 'feature',
    method: RequestMethod.POST,
    jwtSecure: false,
    swaggerInfo: {
      secure: false,
      body: { schema: { $ref: getSchemaPath('AddCardFeatureRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('AddCardFeatureResponseSchema') },
        },
      ],
    },
  } as IRouteParams,
  updateFeatureToCard: {
    path: 'feature',
    method: RequestMethod.PUT,
    jwtSecure: false,
    swaggerInfo: {
      secure: false,
      body: { schema: { $ref: getSchemaPath('UpdateCardFeatureRequestSchema') } },
      responses: [{ status: 200, schema: { $ref: getSchemaPath('UpdateCardFeatureResponse') } }],
    },
  } as IRouteParams,
  addWatcherToCard: {
    path: 'watcher',
    method: RequestMethod.POST,
    jwtSecure: false,
    swaggerInfo: {
      secure: false,
      body: { schema: { $ref: getSchemaPath('AddWatcherToCardRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('AddWatcherToCardResponseSchema') },
        },
      ],
    },
  } as IRouteParams,
  deleteWatcherToCard: {
    path: 'watcher',
    method: RequestMethod.DELETE,
    jwtSecure: false,
    swaggerInfo: {
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
    },
  } as IRouteParams,
  archiveCard: {
    path: 'archive',
    method: RequestMethod.POST,
    jwtSecure: false,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('ArchiveCardRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('ArchiveCardResponseSchema') },
        },
      ],
    },
  } as IRouteParams,
  unarchiveCard: {
    path: 'archive',
    method: RequestMethod.DELETE,
    jwtSecure: false,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('UnArchiveCardRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('UnArchiveCardResponseSchema') },
        },
      ],
    },
  } as IRouteParams,
  moveCard: {
    path: 'move/same',
    method: RequestMethod.POST,
    jwtSecure: false,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('MoveCardSamelistRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('MoveCardSamelistResponseSchema') },
        },
      ],
    },
  } as IRouteParams,
  moveCardNew: {
    path: 'move',
    method: RequestMethod.POST,
    jwtSecure: false,
    swaggerInfo: {
      body: {
        schema: { $ref: getSchemaPath('MoveCardRequestSchema') },
      },
      responses: [{ status: 200, schema: { $ref: getSchemaPath('MoveCardResponseSchema') } }],
    },
  } as IRouteParams,
  deleteFeatureToCard: {
    path: 'feature',
    method: RequestMethod.DELETE,
    jwtSecure: false,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('DeleteFeatureRequestSchema') } },
      responses: [{ status: 200, schema: { $ref: getSchemaPath('MoveCardResponseSchema') } }],
    },
  } as IRouteParams,
  addMemberToCard: {
    path: 'member',
    method: RequestMethod.POST,
    jwtSecure: false,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('AddCardMemberRequestSchema') } },
      responses: [{ status: 200, schema: { $ref: getSchemaPath('AddCardMemberResponseSchema') } }],
    },
  } as IRouteParams,
  deleteMemberToCard: {
    path: 'member',
    method: RequestMethod.DELETE,
    jwtSecure: false,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('AddCardMemberRequestSchema') } },
      responses: [{ status: 200, schema: { $ref: getSchemaPath('AddCardMemberResponseSchema') } }],
    },
  } as IRouteParams,
  makeComment: {
    path: 'comment',
    method: RequestMethod.POST,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('MakeCommentSchemaRequestSchema') } },
      responses: [{ status: 200, schema: { $ref: getSchemaPath('MakeCommentSchemaResponseSchema') } }],
    },
  } as IRouteParams,
} as const
