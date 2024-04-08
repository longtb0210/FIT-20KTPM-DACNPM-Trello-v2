import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
// import { token } from './getInfo'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVS0lSbU9TN2k1dXIwMDlSdHFTMFB6UW80TmpONndydFNjMm1IT3A4cHgwIn0.eyJleHAiOjE3MTI1NTI4MjUsImlhdCI6MTcxMjU1MTAyNSwianRpIjoiMjFiZGFkMDktZDljYi00ZGUxLWI1ZDAtNzQ1NDQ0M2JhYWI1IiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlYzFkOWJiMi05NmEwLTQ5NmQtODIxYi1kOGZjZGU3ZmMxNTAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiMmMwMzcwMTAtMDA1MS00ZDA2LTk3ZmQtMTBiOTU1MTFkNzY5IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vMTI3LjAuMC4xOjMwMDAiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjJjMDM3MDEwLTAwNTEtNGQwNi05N2ZkLTEwYjk1NTExZDc2OSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidnUgdnUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ2dUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoidnUiLCJmYW1pbHlfbmFtZSI6InZ1IiwiZW1haWwiOiJ2dUBnbWFpbC5jb20ifQ.dcUqmPe8X2C2rmiQDAeOzDh5xya5iiOXnBzGzaW5NeT9RPmN4vcj7gKXVCvo87PNQfctuj4u8Z_qbFfPf9FPyAS7rDGYwhej0K33J6usq6XRSq0hmNjvA_bg_qw9giUM9PG6Y9p0T3s-wK0sq6cJjmOuQHrScOeDth-MbDtHshbhbmpHMhU0IzVDQHm-DfP3e7q9i1pnUoULBgIZb964DjSMKC27Uqp3vefUM9Ji0oeCBBobREWgE5ubCGDIBpqzMJIPcJniEQtqupv5Ipu4FeDFHqY8_jU8aBz8JUMzmvPSiyTS_8bEMve56pMYFZ2-OEiURJXm7JOO9KgFkBXFtA'

interface InviteMembers2WorkspaceRequestWithId extends TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequest {
  id: string | undefined
}

const WorkspaceApiSlice = createApi({
  reducerPath: 'WorkspaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URL_API,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.CreateWorspaceRequest
    >({
      query: (data) => ({
        url: '/api/workspace',
        body: data,
        method: 'POST'
      })
    }),
    getAllWorkspace: builder.query<TrelloApi.WorkspaceApi.WorspaceListByEmailResponse, void>({
      query: () => ({
        url: '/api/workspace/all',
        method: 'GET'
      })
    }),
    getAllWorkspaceByEmail: builder.query<TrelloApi.WorkspaceApi.WorspaceListByEmailResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/api/workspace/all/${email}`,
        method: 'GET'
      })
    }),
    getOwnerWorkspacebyEmail: builder.query<TrelloApi.WorkspaceApi.WorspaceResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/api/workspace/role/owner/${email}`,
        method: 'GET'
      })
    }),
    updateWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequest
    >({
      query: (data) => ({
        url: '/api/workspace',
        method: 'PUT',
        body: data
      })
    }),
    getWorkspaceInfo: builder.query<TrelloApi.WorkspaceApi.WorspaceResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/workspace/${id}`,
        method: 'GET'
      })
    }),
    inviteMember2Workspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      InviteMembers2WorkspaceRequestWithId
    >({
      query: (data) => {
        // Omit the id field from the data object
        const { id, ...requestData } = data

        return {
          url: `/api/workspace/invite/${id}`,
          method: 'POST',
          body: { data: requestData }
        }
      }
    }),
    changeWorkspaceVisibility: builder.mutation<void, TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest>({
      query: (data) => ({
        url: `/api/workspace/visibility`,
        method: 'PUT',
        body: { data }
      })
    }),
    deleteWorkspace: builder.mutation<TrelloApi.WorkspaceApi.WorspaceResponse, { workspace_id: string }>({
      query: (data) => ({
        url: `/api/workspace/${data.workspace_id}`,
        method: 'DELETE'
      })
    })
  })
})

export { WorkspaceApiSlice }
