import { IRouteParams } from '@app/common/decorators'
import { RequestMethod } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'

export const CardlistRoutes = {
  index: '/api/cardlist',
  getAllCardlistApi: {
    path: '',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('GetallCardlistResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  createCardlistApi: {
    path: '/create',
    method: RequestMethod.POST,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('CreateCardlistRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('CreateCardlistResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  copyCardlistApi: {
    path: '/copy',
    method: RequestMethod.POST,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('CopyCardlistRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('CopyCardlistResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  getCardlistsByBoardId: {
    path: '/cardlist_by_board/:boardId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'boardId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('GetallCardlistByBoardIdResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  getCardlistsArchivedByBoardId: {
    path: '/cardlist_archived_by_board/:boardId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'boardId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('GetallCardlistArchivedByBoardIdResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  getCardlistsNonArchivedByBoardId: {
    path: '/cardlist_non_archived_by_board/:boardId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'boardId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('GetallCardlistNonArchivedByBoardIdResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  sortCardlistsByOldestDate: {
    path: '/sort_oldest_cardlist/:boardId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'boardId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: {
            $ref: getSchemaPath('SortCardlistByOldestDateResponseSchema'),
          },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  sortCardlistsByNewestDate: {
    path: '/sort_newest_cardlist/:boardId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'boardId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: {
            $ref: getSchemaPath('SortCardlistByNewestDateResponseSchema'),
          },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  sortCardlistsByName: {
    path: '/sort_name_cardlist/:boardId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'boardId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: {
            $ref: getSchemaPath('SortCardlistByNameResponseSchema'),
          },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  sortCardsByOldestDate: {
    path: '/sort_oldest_cards/:cardlistId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'cardlistId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: {
            $ref: getSchemaPath('SortCardByOldestDateResponseSchema'),
          },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  sortCardsByNewestDate: {
    path: '/sort_newest_card/:cardlistId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'cardlistId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: {
            $ref: getSchemaPath('SortCardByNewestDateResponseSchema'),
          },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  sortCardsByName: {
    path: '/sort_name_cards/:cardlistId',
    method: RequestMethod.GET,
    swaggerInfo: {
      params: {
        name: 'cardlistId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: {
            $ref: getSchemaPath('SortCardByNameResponseSchema'),
          },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  updateCardlists: {
    path: '/update',
    method: RequestMethod.PUT,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('UpdateCardlistRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('UpdateCardlistResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  moveCardlists: {
    path: '/move',
    method: RequestMethod.PUT,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('MoveCardlistRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('MoveCardlistResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  moveAllCards: {
    path: '/move_all_cards',
    method: RequestMethod.PUT,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('MoveAllCardsRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('MoveAllCardsResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,

  archiveCardsInList: {
    path: '/archive_cards_in_list/:cardlistId',
    method: RequestMethod.PATCH,
    swaggerInfo: {
      params: {
        name: 'cardlistId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: {
            $ref: getSchemaPath('ArchiveAllCardsInListResponseSchema'),
          },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  archiveCardList: {
    path: '/archive_card_list/:cardlistId',
    method: RequestMethod.PATCH,
    swaggerInfo: {
      params: {
        name: 'cardlistId',
        schema: {
          type: 'string',
        },
      },
      responses: [
        {
          status: 200,
          schema: {
            $ref: getSchemaPath('ArchiveCardlistResponseSchema'),
          },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  addWatcher: {
    path: '/add_watcher',
    method: RequestMethod.PATCH,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('AddWatcherRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('AddWatcherResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  addCardTolist: {
    path: '/add_card',
    method: RequestMethod.POST,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('AddCardToListRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('AddCardToListResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  cloneCardlists: {
    path: '/clone_cardlists',
    method: RequestMethod.POST,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('CloneCardlistsToNewBoardRequestSchema') } },
      responses: [
        {
          status: 200,
          schema: { $ref: getSchemaPath('CloneCardlistsToNewBoardResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
  deleteCardlistsByBoardId: {
    path: '/delete_cardlists_by_board_id',
    method: RequestMethod.DELETE,
    swaggerInfo: {
      body: { schema: { $ref: getSchemaPath('DeleteCardlistsByBoardIdRequestSchema') } },
      responses: [
        {
          status: 200,
          // schema: { $ref: getSchemaPath('CloneCardlistsToNewBoardResponseSchema') },
        },
      ],
    },
    // jwtSecure: false,
  } as IRouteParams,
} as const
