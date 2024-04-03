import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
import { token } from './getInfo'
export const CardApiSlice = createApi({
  reducerPath: 'CardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:10000',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  endpoints: (build) => ({
    createCard: build.mutation<TrelloApi.CardApi.CreateCardRespond, TrelloApi.CardApi.CreateCardRequest>({
      query: (data) => ({
        url: '/api/card/',
        method: 'POST',
        body: {
          ...data
          // cardlist_id: 'demo_cardlist'
        }
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
    moveCardDifList: build.mutation<
      TrelloApi.CardApi.MoveCardSamelistResponse,
      TrelloApi.CardApi.MoveCardSamelistRequest
    >({
      query: (data) => ({
        url: '/api/card/move',
        method: 'PUT',
        body: {
          ...data
          // cardlist_id: 'demo_cardlist'
        }
      })
    })
  })
})
