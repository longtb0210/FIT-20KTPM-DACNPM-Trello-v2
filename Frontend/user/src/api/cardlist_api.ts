import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
import { RootState } from '~/store'

export const CardListApiSlice = createApi({
  reducerPath: 'CardlistApi',
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
    getAllCardlist: build.query<TrelloApi.CardlistApi.GetallCardlistResponse, void>({
      query: () => ({
        url: '/api/cardlist'
      })
    }),
    getCardlistByBoardId: build.query<
      TrelloApi.CardlistApi.GetallCardlistByBoardIdResponse,
      { id: string | undefined }
    >({
      query: ({ id }) => ({
        url: `/api/cardlist/cardlist_by_board/${id}`,
        method: 'GET'
      })
    }),
    addCardOnTop: build.mutation<
      TrelloApi.CardlistApi.AddCardToListResponse,
      TrelloApi.CardlistApi.AddCardToListRequest
    >({
      query: (data) => ({
        url: `/api/cardlist/add_card`,
        method: 'POST',
        body: {
          ...data
        }
      })
    }),
    createCardlist: build.mutation<
      TrelloApi.CardlistApi.CreateCardlistResponse,
      TrelloApi.CardlistApi.CreateCardlistRequest
    >({
      query: (data) => ({
        method: 'POST',
        url: '/api/cardlist/create',
        body: data
      })
    }),
    updateCardList: build.mutation<
      TrelloApi.CardlistApi.UpdateCardlistResponse,
      TrelloApi.CardlistApi.UpdateCardlistRequest
    >({
      query: (data) => ({
        method: 'PUT',
        url: '/api/cardlist/update/',
        body: {
          ...data
        }
      })
    }),
    moveCardList: build.mutation<
      TrelloApi.CardlistApi.MoveCardlistInBoardResponse,
      TrelloApi.CardlistApi.MoveCardlistInBoardRequest
    >({
      query: (data) => ({
        method: 'PUT',
        url: '/api/cardlist/move_cardlists_in_board',
        body: {
          ...data
        }
      })
    }),
    copyCardList: build.mutation<TrelloApi.CardlistApi.CopyCardlistResponse, TrelloApi.CardlistApi.CopyCardlistRequest>(
      {
        query: (data) => ({
          method: 'POST',
          url: '/api/cardlist/copy',
          body: {
            ...data
          }
        })
      }
    ),
    archiveAllCardInCardList: build.mutation<
      TrelloApi.CardlistApi.ArchiveAllCardsInListResponse,
      { cardListId: string }
    >({
      query: ({ cardListId }) => ({
        method: 'PATCH',
        url: `/api/cardlist/archive_cards_in_list/${cardListId}`
      })
    }),
    archiveCardList: build.mutation<TrelloApi.CardlistApi.ArchiveAllCardsInListResponse, { cardListId: string }>({
      query: ({ cardListId }) => ({
        method: 'PATCH',
        url: `/api/cardlist/archive_card_list/${cardListId}`
      })
    })
  })
})
