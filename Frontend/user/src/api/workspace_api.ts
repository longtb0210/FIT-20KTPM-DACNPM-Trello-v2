import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const WorkspaceApiSlice = createApi({
  reducerPath: 'WorkspaceApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3333' }),
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.CreateWorspaceRequest
    >({
      query: (data) => ({
        url: '/api/worspace',
        body: data,
        method: 'POST'
      })
    }),
    getAllWorkspace: builder.query<TrelloApi.WorkspaceApi.WorspaceListByEmailResponse, void>({
      query: () => ({
        url: '/api/workspace/all/long@gmail.com',
        method: 'GET'
      })
    })
  })
})

export { WorkspaceApiSlice }
