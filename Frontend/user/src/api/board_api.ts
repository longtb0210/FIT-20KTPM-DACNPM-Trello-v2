import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
//import { token } from './getInfo'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVS0lSbU9TN2k1dXIwMDlSdHFTMFB6UW80TmpONndydFNjMm1IT3A4cHgwIn0.eyJleHAiOjE3MTI1NTI4MjUsImlhdCI6MTcxMjU1MTAyNSwianRpIjoiMjFiZGFkMDktZDljYi00ZGUxLWI1ZDAtNzQ1NDQ0M2JhYWI1IiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlYzFkOWJiMi05NmEwLTQ5NmQtODIxYi1kOGZjZGU3ZmMxNTAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiMmMwMzcwMTAtMDA1MS00ZDA2LTk3ZmQtMTBiOTU1MTFkNzY5IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vMTI3LjAuMC4xOjMwMDAiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjJjMDM3MDEwLTAwNTEtNGQwNi05N2ZkLTEwYjk1NTExZDc2OSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidnUgdnUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ2dUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoidnUiLCJmYW1pbHlfbmFtZSI6InZ1IiwiZW1haWwiOiJ2dUBnbWFpbC5jb20ifQ.dcUqmPe8X2C2rmiQDAeOzDh5xya5iiOXnBzGzaW5NeT9RPmN4vcj7gKXVCvo87PNQfctuj4u8Z_qbFfPf9FPyAS7rDGYwhej0K33J6usq6XRSq0hmNjvA_bg_qw9giUM9PG6Y9p0T3s-wK0sq6cJjmOuQHrScOeDth-MbDtHshbhbmpHMhU0IzVDQHm-DfP3e7q9i1pnUoULBgIZb964DjSMKC27Uqp3vefUM9Ji0oeCBBobREWgE5ubCGDIBpqzMJIPcJniEQtqupv5Ipu4FeDFHqY8_jU8aBz8JUMzmvPSiyTS_8bEMve56pMYFZ2-OEiURJXm7JOO9KgFkBXFtA'

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
    }),
    getBoardsByWorkspaceID: builder.query<TrelloApi.BoardApi.getBoardsByWorkspaceIdResponse, { workspace_id: string }>({
      query: ({ workspace_id }) => ({
        url: `/api/board/workspace/${workspace_id}`,
        method: 'GET'
      })
    })
  })
})

export { BoardApiSlice }
