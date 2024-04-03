import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVS0lSbU9TN2k1dXIwMDlSdHFTMFB6UW80TmpONndydFNjMm1IT3A4cHgwIn0.eyJleHAiOjE3MTIxNDM1NzgsImlhdCI6MTcxMjE0MTc3OCwianRpIjoiNGJiNmEzZmYtYmI2Zi00OTMwLTkzZmUtZDZjZmZkM2FmYjlhIiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJmOTkzYTM2My1lNWEyLTQzNzgtOWUxOS1iYTU0M2E4Njc0MzMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiOTlmOWE3MjItOTc1NS00NzI3LWE5NWMtMTZlNGVjMjc5YTgyIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vMTI3LjAuMC4xOjMwMDAiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6Ijk5ZjlhNzIyLTk3NTUtNDcyNy1hOTVjLTE2ZTRlYzI3OWE4MiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IlRy4bqnbiBI4buvdSBDaMOtbmgiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0cmFuaHV1Y2hpbmg1MDBAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlRy4bqnbiBI4buvdSIsImZhbWlseV9uYW1lIjoiQ2jDrW5oIiwiZW1haWwiOiJ0cmFuaHV1Y2hpbmg1MDBAZ21haWwuY29tIn0.AqKIjPJDzwBQzjCMZLwjpu74RrSQRKwcYdzg0rMwaAUlR9e0YLevRd93MLGFXv21IboDI8NGUtPILZ0z7zTWGqVcgfH7D-weXliWAXYIQS04FC5G1g5x6a3QUnyD1Ld5gEIEfL2W8Vp0yi1pOyospnNXMyIz578du8mpj2ANzCm4VmvVKh70aOuRhbq3Tnb2AjqAQ4-zxPWA4a1YdE1GlTQT2FPdVB_7tbxGp4N2rjycWWL6onQvxm46JTEbp8iGvdd0urJglTKJ3UJtDENiDNnxGHza3lZvHBKO056ww8ibyZF4jDeplykWGJTCIirDsBwTTV66Vt04PDahKUnOKQ'
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json' // Header Content-Type
}

const WorkspaceApiSlice = createApi({
  reducerPath: 'WorkspaceApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_URL_API }),
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.CreateWorspaceRequest
    >({
      query: (data) => ({
        url: '/api/workspace',
        body: data,
        headers: headers,
        method: 'POST'
      })
    }),
    getAllWorkspace: builder.query<TrelloApi.WorkspaceApi.WorkspaceListResponse, void>({
      query: () => {
        // const token = JSON.parse(localStorage.getItem('data') || '').token

        return {
          url: '/api/workspace/',
          headers: headers,
          method: 'GET'
        }
      }
    })
  })
})

export { WorkspaceApiSlice }
