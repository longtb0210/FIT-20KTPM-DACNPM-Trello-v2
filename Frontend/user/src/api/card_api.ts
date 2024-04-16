import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
import { RootState } from '~/store'

export const CardApiSlice = createApi({
  reducerPath: 'CardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URL_API,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).KC_TOKEN?.acessToken

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: (build) => ({
    createCard: build.mutation<TrelloApi.CardApi.CreateCardRespond, TrelloApi.CardApi.CreateCardRequest>({
      query: (data) => ({
        url: '/api/card/',
        method: 'POST',
        body: data
      })
    }),
    getCardsOfCardlist: build.query<
      TrelloApi.CardApi.GetAllCardsOfCardlistResponse,
      TrelloApi.CardApi.GetCardsOfCardlistRequest
    >({
      query: (params) => ({
        url: '/api/card',
        method: 'GET',
        params: params
      })
    }),
    getCardDetail: build.query<TrelloApi.CardApi.GetCardDetailResponse, TrelloApi.CardApi.GetCardDetailRequest>({
      query: (params) => ({
        url: '/api/card/detail',
        method: 'GET',
        params: params
      })
    }),
    updateCardDetail: build.mutation<
      TrelloApi.CardApi.UpdateCardDetailResponse,
      TrelloApi.CardApi.UpdateCardDetailRequest
    >({
      query: (data) => ({
        url: '/api/card/detail',
        method: 'PUT',
        body: data
      })
    }),
    addCardWatcher: build.mutation<
      TrelloApi.CardApi.AddWatcherToCardResponse,
      TrelloApi.CardApi.AddWatcherToCardRequest
    >({
      query: (data) => ({
        url: '/api/card/watcher',
        method: 'POST',
        body: data
      })
    }),
    deleteCardWatcher: build.mutation<
      TrelloApi.CardApi.DeleteWatcherToCardResponse,
      TrelloApi.CardApi.DeleteWatcherToCardRequest
    >({
      query: (data) => ({
        url: '/api/card/watcher',
        method: 'DELETE',
        body: {
          ...data
        }
      })
    }),
    addCardFeature: build.mutation<TrelloApi.CardApi.AddCardFeatureResponse, TrelloApi.CardApi.AddCardFeatureRequest>({
      query: (data) => ({
        url: '/api/card/feature',
        method: 'POST',
        body: data
      })
    }),
    updateCardFeature: build.mutation<
      TrelloApi.CardApi.UpdateCardFeatureResponse,
      TrelloApi.CardApi.UpdateCardFeatureRequest
    >({
      query: (data) => ({
        url: '/api/card/feature',
        method: 'PUT',
        body: data
      })
    }),
    deleteCardFeature: build.mutation<TrelloApi.CardApi.DeleteFeatureResponse, TrelloApi.CardApi.DeleteFeatureRequest>({
      query: (data) => ({
        url: '/api/card/feature',
        method: 'DELETE',
        body: data
      })
    }),
    updateCard: build.mutation<TrelloApi.CardApi.UpdateCardDetailResponse, TrelloApi.CardApi.UpdateCardDetailRequest>({
      query: (data) => ({
        url: '/api/card/detail/',
        method: 'PUT',
        body: {
          ...data
          // cardlist_id: 'demo_cardlist'
        }
      })
    }),
    moveCardSameList: build.mutation<
      TrelloApi.CardApi.MoveCardSamelistResponse,
      TrelloApi.CardApi.MoveCardSamelistRequest
    >({
      query: (data) => ({
        url: '/api/card/move/same',
        method: 'PUT',
        body: {
          ...data
          // cardlist_id: 'demo_cardlist'
        }
      })
    }),
    moveCard: build.mutation<TrelloApi.CardApi.MoveCardResponse, TrelloApi.CardApi.MoveCardRequest>({
      query: (data) => ({
        url: '/api/card/move',
        method: 'POST',
        body: {
          ...data
        }
      })
    }),
    addCardMember: build.mutation<TrelloApi.CardApi.AddCardMemberResponse, TrelloApi.CardApi.AddCardMemberRequest>({
      query: (data) => ({
        url: '/api/card/member',
        method: 'POST',
        body: data
      })
    }),
    deleteCardMember: build.mutation<
      TrelloApi.CardApi.DeleteCardMemberResponse,
      TrelloApi.CardApi.DeleteCardMemberRequest
    >({
      query: (data) => ({
        url: '/api/card/member',
        method: 'DELETE',
        body: {
          ...data
        }
      })
    }),
    archiveCard: build.mutation<TrelloApi.CardApi.ArchiveCardResponse, TrelloApi.CardApi.ArchiveCardRequest>({
      query: (data) => ({
        url: '/api/card/archive',
        method: 'POST',
        body: data
      })
    }),
    unArchiveCard: build.mutation<TrelloApi.CardApi.UnArchiveCardResponse, TrelloApi.CardApi.ArchiveCardRequest>({
      query: (data) => ({
        url: '/api/card/archive',
        method: 'DELETE',
        body: data
      })
    }),
    restoreCartToBoard: build.mutation<TrelloApi.CardApi.UnArchiveCardResponse, TrelloApi.CardApi.UnArchiveCardRequest>(
      {
        query: (data) => ({
          url: '/api/card/archive',
          method: 'DELETE',
          body: data
        })
      }
    ),
    deleteCardArchive: build.mutation<TrelloApi.CardApi.UnArchiveCardResponse, TrelloApi.CardApi.UnArchiveCardRequest>({
      query: (data) => ({
        url: '/api/card/archive',
        method: 'DELETE',
        body: data
      })
    }),
    addComment: build.mutation<
      TrelloApi.CardApi.UpdateCardDetailResponse,
      { card_id: string; cardlist_id: string; content: string }
    >({
      query: ({ card_id, cardlist_id, content }) => ({
        url: '/api/card/comment',
        method: 'POST',
        body: {
          card_id: card_id,
          cardlist_id: cardlist_id,
          content: content
        }
      })
    }),
    getCardArchiveByBoardId: build.query<
      {
        data: {
          name: string
          _id: string
          watcher_email: string[]
          member_email: string[]
          created_at: Date
          index?: number | null | undefined
          archive_at?: Date | null | undefined
          cover?: string | null | undefined
          description?: string | null | undefined
        }[]
      },
      { board_id: string }
    >({
      query: (data) => ({
        url: `/api/card/archive/byBoardId?board_id=${data.board_id}`,
        method: 'GET'
      })
    }),
    RestoreCardArchive: build.mutation<
      TrelloApi.CardApi.UpdateCardDetailResponse,
      { cardlist_id: string; card_id: string; archive_at: Date }
    >({
      query: (data) => ({
        url: '/api/card/detail',
        method: 'PUT',
        body: data
      })
    })
  })
})
