import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const UserApiSlice = createApi({
  reducerPath: 'UserApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_URL_API }),
  endpoints: (builder) => ({
    createUser: builder.mutation<TrelloApi.UserApi.CreateUserResponse, TrelloApi.UserApi.CreateUserRequest>({
      query: (data) => {
        const token = JSON.parse(localStorage.getItem('data') || '').token
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Header Content-Type
        }
        return {
          url: '/api/user',
          body: data,
          headers: headers,
          method: 'POST'
        }
      }
    }),
    getAllUser: builder.query<TrelloApi.UserApi.GetallUserResponse, void>({
      query: () => {
        return {
          url: '/api/user',
          method: 'GET'
        }
      }
    })
  })
})

export { UserApiSlice }
