import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'

import { token } from './getInfo'

export const CardApiSlice = createApi({
  reducerPath: 'CardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URL_API,
    headers: {
      Authorization: `Bearer ${token}`
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
