import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJSUHBQZ09sTjVINUxiVzQzeFFYcC1jQkVrcFg4SjZMTFJEVUFzN3J1R0JjIn0.eyJleHAiOjE3MTE5Nzk3ODYsImlhdCI6MTcxMTk3Nzk4NiwianRpIjoiMjBiOWQzODgtYTU1NC00ZDRkLTk2Y2UtMDNkZWU2YzE5M2MyIiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI3ZWNlMjI0NC05YjhhLTQxNGYtOTEyZC05NTY4Y2I1NjEwMWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiNTE1OWEyYTMtMTQ3Yy00N2ExLTk3ZmEtMDhlMjc3ZTEyMDhhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtdHJlbGxvIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiNTE1OWEyYTMtMTQ3Yy00N2ExLTk3ZmEtMDhlMjc3ZTEyMDhhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJ2dSBuZ28iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ2dXgiLCJnaXZlbl9uYW1lIjoidnUiLCJmYW1pbHlfbmFtZSI6Im5nbyIsImVtYWlsIjoidnVAZ21haWwuY29tIn0.nSozgmGBg2kZ910w3tqPMAYCdz2Tzuhlq7sqrSQs7zigKIO051xwk2KO5qd_ZSrfqedF8VLWYE0OuzGsgbFZZXekxQS8nOS6XitqG4r55mlvpA15Q-vM96LByb6LHIn5or2ArAS28Xxkm8LCi2w6cTKC3oGClg7GS9kVLevaSbjETYeSQCJRKQw5xK-K7kG3EciRFq60d-JFb2OnafUrrjkrpigng-LM-XWyq9DLdE3ohOy7l4y-uQ9sWd0XxOtzXAiCZgsX5qHBenZHVkIZfUfskF7t4qZT90XuR6FKH6XfRy3TH2w5NOBO9DFylEvYh9Y8xUswH9NHYKWwUgwiBA'
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
