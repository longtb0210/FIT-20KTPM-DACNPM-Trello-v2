import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJJeTRaRVRpQVp3OUwtN1hQQWJPN1RxclNjYW9EN1pNQVNTSUNRWEVsLTBzIn0.eyJleHAiOjE3MTE4NjgwMzksImlhdCI6MTcxMTgzMjAzOSwianRpIjoiMGM1Njc2NzMtMjI5OS00YTA3LWFhZmUtMTg3MDhhMDBmMWJiIiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlY2Q0NWQ1ZS03NGY2LTRmYjctYjk4NS0yYjdkYWViYWQzZmMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiYmM5ZDU3ZDItMTdhNC00MDk4LWE5YjUtOGUwMWIyMzJiN2Y4IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3d3dy5rZXljbG9hay5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImJjOWQ1N2QyLTE3YTQtNDA5OC1hOWI1LThlMDFiMjMyYjdmOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVGluIFRyYW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0aW4xMjMiLCJnaXZlbl9uYW1lIjoiVGluIiwiZmFtaWx5X25hbWUiOiJUcmFuIiwiZW1haWwiOiJib3RvbXRpbmxvbkBnbWFpbC5jb20ifQ.GLiCTaLVQfa5jE7cH2HZSD2gUGIRLrOQ7NpIzqmFDXSfIfvCbGLUtmDC8zsOaWuFtFL9zyaE8eR25MYC5q_OioIEjvq0i5ibdADzmIJ3cMiPTYiTT-RCnHeXpaR1da51-TNt6Fl8FL3DHC1jOH1Anl_zN0tUxVB1CnFYGHMEpzAK9vpdjtq-ja0Xrm1d9jOi2nbWTmPi0DHm0qjrEfqEVLVfOZoxaBu-wAPFoKVbano2x66jfICMipgw13P65_aqh-HyMTYd46iTPLIXLZv0VQfapJxOErovCUpOmEAEvonqACFM6Miajq88KduHJjEfKXunf-lLujXOdUJ94ZXHFA'
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
    }),
    updateCardList: build.mutation<
      TrelloApi.CardlistApi.UpdateCardlistResponse,
      TrelloApi.CardlistApi.UpdateCardlistRequest
    >({
      query: (data) => ({
        method: 'PUT',
        url: '/api/cardlist/update/',
        body: {
          ...data
        }
      })
    })
  })
})
