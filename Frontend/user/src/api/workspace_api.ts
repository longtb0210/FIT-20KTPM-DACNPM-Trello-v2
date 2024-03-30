import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJJeTRaRVRpQVp3OUwtN1hQQWJPN1RxclNjYW9EN1pNQVNTSUNRWEVsLTBzIn0.eyJleHAiOjE3MTE2NTIwMjEsImlhdCI6MTcxMTYxNjAyMSwianRpIjoiMWEzYmRhZmItODNlZS00YWM5LTliMTEtYzQ0NWY5Mjg4ZTc4IiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyZThlNjY3NC1lNjI3LTQxZWMtYTU0MC1lYzQxNmRmMDFjNTMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiZGQ2MWEwM2EtN2EwNC00ZDY2LWI1NWYtOWFlNjNiYmM1ZTE0IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3d3dy5rZXljbG9hay5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImRkNjFhMDNhLTdhMDQtNGQ2Ni1iNTVmLTlhZTYzYmJjNWUxNCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidnUgYW5oIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidnV4IiwiZ2l2ZW5fbmFtZSI6InZ1IiwiZmFtaWx5X25hbWUiOiJhbmgiLCJlbWFpbCI6InZ1QGdtYWlsLmNvbSJ9.BxNka2zUxuPHOtYykn9hN1Tk4IK3orxrRuTfvMHokQNqgeHIwa1xgBAf1G5cOjFEC7pyPk88NcvjrS9wto8Y58IqOxzeHWDxhdLQDRxr7IewD_2OSTLf-j5O7TMFFjeH7yGOrQSGh0JEE_PSiAfraqmCl_pq9F49xJPewNNd5gYjql0-Hw3dEaZ8pmxYIrJyipqgX6iKt-IpqCpjZ1xeo1sCxgfqm233W3j1ZWIuhEk3inIn4N5vAj6RA1V1NWjULPn5_cf0KnLqy0Ghzc7zOANWx4KH9n50PtAqpS79JQ03KS9ct_kkIN3lYUAqnSzDqhmHxhVGW0wQ6Z53F-Klow'
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
