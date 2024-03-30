import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJJeTRaRVRpQVp3OUwtN1hQQWJPN1RxclNjYW9EN1pNQVNTSUNRWEVsLTBzIn0.eyJleHAiOjE3MTE3MzcyMTIsImlhdCI6MTcxMTcwMTIxMiwianRpIjoiNmZjODQ2YTUtOTUwZS00NWYzLTkwMTktZjhkZWNkZDg4OWMyIiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyZThlNjY3NC1lNjI3LTQxZWMtYTU0MC1lYzQxNmRmMDFjNTMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiMGEwNjdlMDktYjM5YS00NmQ5LTkyZTAtYTI5MzFjODEwYzg2IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3d3dy5rZXljbG9hay5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjBhMDY3ZTA5LWIzOWEtNDZkOS05MmUwLWEyOTMxYzgxMGM4NiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidnUgYW5oIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidnV4IiwiZ2l2ZW5fbmFtZSI6InZ1IiwiZmFtaWx5X25hbWUiOiJhbmgiLCJlbWFpbCI6InZ1QGdtYWlsLmNvbSJ9.MJVhHbntRudubJMXM_E5RaHMMX5-ur3BZMlq5F_w1UO_abmay7af7hhhWdule5ZxI5FXs96K9X2vs4zDLto5XkJ0YZwpefMxM_9_OgMbM-OzcbEcrps7nqAIYgf-Cg20nLUz0Lksfn-HpP4JE2f_7qXF4qT7ckpfUo5tHcLMBy6apoWyXk-pEux-WYlhapLntTLXsvIxJM3PviWZGgQdiJ704YgSwFatak90SinXkqOuIUBi6qIUuJywMr51S_smX7-OOM4g2hPACvCwtWtupxLdnOh3mw9HBHG7AlzHiHSs39uxROOsxp8RFKshB-cb0rXTZWUMnspfACy9gCCIyQ'
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
    createCardlist: build.mutation<
      TrelloApi.CardlistApi.CreateCardlistResponse,
      TrelloApi.CardlistApi.CreateCardlistRequest
    >({
      query: (data) => ({
        method: 'POST',
        url: '/api/cardlist/create',
        body: {
          ...data
        }
      })
    })
  })
})
