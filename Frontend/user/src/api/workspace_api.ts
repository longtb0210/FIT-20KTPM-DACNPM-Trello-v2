import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJJeTRaRVRpQVp3OUwtN1hQQWJPN1RxclNjYW9EN1pNQVNTSUNRWEVsLTBzIn0.eyJleHAiOjE3MTE4OTU2ODgsImlhdCI6MTcxMTg1OTY4OCwianRpIjoiNDNkYzUwNGItN2YxMi00NmQwLTlkNTktZTlhYjFmMjViNmEzIiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyZThlNjY3NC1lNjI3LTQxZWMtYTU0MC1lYzQxNmRmMDFjNTMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiYWRjZjI0NzgtY2Q2NS00ODI4LTk0MTctZjBmNTcwM2RmYjY4IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3d3dy5rZXljbG9hay5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImFkY2YyNDc4LWNkNjUtNDgyOC05NDE3LWYwZjU3MDNkZmI2OCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidnUgYW5oIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidnV4IiwiZ2l2ZW5fbmFtZSI6InZ1IiwiZmFtaWx5X25hbWUiOiJhbmgiLCJlbWFpbCI6InZ1QGdtYWlsLmNvbSJ9.GZAYkOFVRxBAq0ojq-W4bBsMuZVTcuclm-xmnKMcaM2KANZ947hPN3B2zrGkXyfLeMXz4X4WTyOdgL6OlnSAE3hGJM3ON3etJpq22msJU-3-_Kewy8-w6q7iPZ8J0y1gAC3wJnTtmLggmyDg2Exgq37LeFv-ePtKjmGmAfi7puqSp2jT4eyS9F_-Gtc9RdeOV0UdrDq6cpnl9X-72giwrcFFbpoxWqeGapkyfO9rIlBltgH9PiL_0O6vfx5NdovgFP3XiQpKldg1Wzcq8bB4RJJSAbpFEYCgETVijZEOfAvrALnBwe3R8JvLV4XVOzHzt0YeZ7XfGt2ely3XHim_6Q'
const WorkspaceApiSlice = createApi({
  reducerPath: 'WorkspaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:10000',
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
        url: '/api/worspace',
        body: data,
        method: 'POST'
      })
    }),
    getAllWorkspace: builder.query<TrelloApi.WorkspaceApi.WorspaceListByEmailResponse, void>({
      query: () => ({
        url: '/api/workspace/all',
        method: 'GET'
      })
    })
  })
})

export { WorkspaceApiSlice }
