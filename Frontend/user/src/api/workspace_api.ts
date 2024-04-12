import { RootState } from '~/store'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'

interface InviteMembers2WorkspaceRequestWithId extends TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequest {
  id: string | undefined
}

const WorkspaceApiSlice = createApi({
  reducerPath: 'WorkspaceApi',
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
    createWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorkspaceResponse,
      TrelloApi.WorkspaceApi.CreateWorkspaceRequest
    >({
      query: (data) => ({
        url: '/api/workspace',
        body: data,
        method: 'POST'
      })
    }),
    getAllWorkspace: builder.query<TrelloApi.WorkspaceApi.WorkspaceListByEmailResponse, void>({
      query: () => ({
        url: '/api/workspace/all',
        method: 'GET'
      })
    }),
    getAllUserWorkspace: builder.query<TrelloApi.WorkspaceApi.WorkspaceListByEmailResponse, void>({
      query: () => ({
        url: `/api/workspace/all`,
        method: 'GET'
      })
    }),
    getOwnerWorkspacebyEmail: builder.query<TrelloApi.WorkspaceApi.WorkspaceResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/api/workspace/role/owner/${email}`,
        method: 'GET'
      })
    }),
    updateWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorkspaceResponse,
      TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequest
    >({
      query: (data) => ({
        url: '/api/workspace',
        method: 'PUT',
        body: data
      })
    }),
    getWorkspaceInfo: builder.query<TrelloApi.WorkspaceApi.WorkspaceResponse, string>({
      query: (id) => ({
        url: `/api/workspace/${id}`,
        method: 'GET'
      })
    }),
    inviteMember2Workspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorkspaceResponse,
      InviteMembers2WorkspaceRequestWithId
    >({
      query: (data) => {
        // Omit the id field from the data object
        const { id, ...requestData } = data
        console.log(id)
        console.log(requestData)
        return {
          url: `/api/workspace/invite/${id}`,
          method: 'POST',
          body: { ...requestData }
        }
      }
    }),
    changeWorkspaceVisibility: builder.mutation<
      TrelloApi.WorkspaceApi.WorkspaceResponse,
      TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest
    >({
      query: (data) => ({
        url: `/api/workspace/visibility`,
        method: 'PUT',
        body: { ...data }
      })
    }),
    deleteWorkspace: builder.mutation<TrelloApi.WorkspaceApi.WorkspaceResponse, { workspace_id: string }>({
      query: (data) => ({
        url: `/api/workspace/${data.workspace_id}`,
        method: 'DELETE'
      })
    }),
    getWorkspaceByID: builder.mutation<TrelloApi.WorkspaceApi.WorkspaceResponse, { workspace_id: string }>({
      query: ({ workspace_id }) => ({
        url: `/api/workspace/${workspace_id}`,
        method: 'GET'
      })
    })
  })
})

export { WorkspaceApiSlice }
