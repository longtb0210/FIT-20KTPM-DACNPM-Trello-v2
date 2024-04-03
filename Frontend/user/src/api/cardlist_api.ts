import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVS0lSbU9TN2k1dXIwMDlSdHFTMFB6UW80TmpONndydFNjMm1IT3A4cHgwIn0.eyJleHAiOjE3MTIxMjkzNTgsImlhdCI6MTcxMjEyNzU1OCwianRpIjoiN2QxMzk1YWItNDM5Ni00YTE1LWE2OTEtYjcyMmZjNzQzYTk0IiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlYzFkOWJiMi05NmEwLTQ5NmQtODIxYi1kOGZjZGU3ZmMxNTAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiZWUzZWRiYmQtZjQwMS00ZWJjLTliMmItMjViMGNiZGJlNTEyIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vMTI3LjAuMC4xOjMwMDAiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6ImVlM2VkYmJkLWY0MDEtNGViYy05YjJiLTI1YjBjYmRiZTUxMiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidnUgdnUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ2dUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoidnUiLCJmYW1pbHlfbmFtZSI6InZ1IiwiZW1haWwiOiJ2dUBnbWFpbC5jb20ifQ.o7kI9QEZTncEZ-9yqZ7sQ3Bpd3n_76sznDeLFMnyTFfmgpdfKdZhl6pBrIyqFqZBJHlxjPHdUR6rpz3CGQMD_h_rNmu5niEsgfowlsdVOsLC-3lO8n6zHS-EZuZ6khhhxhCzSCinHug4YOEYxgZHIihud52_QtaBpHOIhSiu1hcuwunrIV2mYif4ZPstNUioNkyryfFoMH3yzWoZK9uJNl8SP068vXe0to-5Gazyu2ohkFaQEMC5o9Mwmv9wh-fpid8LqceGcEzFnDqJvMBXo7i2TGqfbqIqk_4Tq_Sq4hhSCxrVyTnCrHOEl2FIhcmPE-xCYF3hM9mfoGy8iO_6yw'
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
        body: data
      })
    })
  })
})
