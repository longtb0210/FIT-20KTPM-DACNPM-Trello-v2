import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'

import { token } from './getInfo'

const BoardApiSlice = createApi({
  reducerPath: 'BoardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URL_API,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  endpoints: (builder) => ({
    createBoard: builder.mutation<TrelloApi.BoardApi.CreateBoardResponse, TrelloApi.BoardApi.CreateBoard>({
      query: (data) => ({
        url: '/api/board',
        body: data,
        method: 'POST'
      })
    }),
    getAllBoard: builder.query<TrelloApi.BoardApi.GetallBoardResponse, void>({
      query: () => ({
        url: '/api/board',
        method: 'GET'
      })
    }),
    getBoardById: builder.query<TrelloApi.BoardApi.GetBoardInfoByBoardIdResponse, TrelloApi.BoardApi.BoardIdRequest>({
      query: (data) => ({
        url: `/api/board/${data}`,
        method: 'GET'
      })
    }),
    editBoardById: builder.mutation<TrelloApi.BoardApi.UpdateBoardResponse, TrelloApi.BoardApi.UpdateBoardRequest>({
      query: (data) => ({
        url: '/api/board',
        body: data,
        method: 'PATCH'
      })
    })
  })
})

export { BoardApiSlice }
