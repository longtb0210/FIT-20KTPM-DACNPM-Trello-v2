import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
import { token } from './getInfo'
export const CardListApiSlice = createApi({
  reducerPath: 'CardlistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:10000',
    headers: {
      Authorization: `Bearer ${token}`
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
    })
  })
})
