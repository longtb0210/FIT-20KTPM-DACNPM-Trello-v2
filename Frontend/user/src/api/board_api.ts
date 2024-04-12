import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
import { RootState } from '~/store'

const BoardApiSlice = createApi({
  reducerPath: 'BoardApi',
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
      query: (id) => ({
        url: `/api/board/${id}`,
        method: 'GET'
      })
    }),
    getBoardByWorkspaceId: builder.query<TrelloApi.BoardApi.getBoardsByWorkspaceIdResponse, { workspaceId: string | undefined }>({
      query: ({workspaceId}) => ({
        url: `/api/board/workspace/${workspaceId}`,
        method: 'GET'
      })
    }),
    editBoardById: builder.mutation<TrelloApi.BoardApi.UpdateBoardResponse, TrelloApi.BoardApi.UpdateBoardRequest>({
      query: (data) => ({
        url: '/api/board',
        body: data,
        method: 'PATCH'
      })
    }),
    getBoardsByWorkspaceID: builder.query<TrelloApi.BoardApi.getBoardsByWorkspaceIdResponse, { workspace_id: string }>({
      query: ({ workspace_id }) => ({
        url: `/api/board/workspace/${workspace_id}`,
        method: 'GET'
      })
    }),
    addBackgroundBoard: builder.mutation<TrelloApi.BoardApi.UpdateBoardResponse, { id: string; background: File }>({
      query: (data) => ({
        url: `/api/board/${data.id}/background_list/add`,
        body: data,
        method: 'POST'
      })
    }),
    addWatcherMember: builder.mutation<TrelloApi.BoardApi.AddMemberResponse, TrelloApi.BoardApi.AddWatcherRequest>({
      query: (data) => ({
        url: `/api/board/watchers/add`,
        body: data,
        method: 'POST'
      })
    }),
    removeWatcherMember: builder.mutation<
      TrelloApi.BoardApi.RemoveMemberResponse,
      TrelloApi.BoardApi.RemoveMemberRequest
    >({
      query: (data) => ({
        url: `/api/board/watchers/remove`,
        body: data,
        method: 'POST'
      })
    }),
    removeMemberInBoardByEmail: builder.mutation<
      TrelloApi.BoardApi.RemoveMemberResponse,
      TrelloApi.BoardApi.RemoveMemberRequest
    >({
      query: (data) => ({
        url: `/api/board/members/remove`,
        body: data,
        method: 'POST'
      })
    })
  })
})

export { BoardApiSlice }
