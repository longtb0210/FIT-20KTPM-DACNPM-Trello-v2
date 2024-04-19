import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
import { RootState } from '~/store'

const UserApiSlice = createApi({
  reducerPath: 'UserdApi',
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
    getUser: builder.mutation<TrelloApi.UserApi.GetUserResponse, void>({
      query: () => ({
        url: `/api/user`,
        method: 'GET'
      })
    }),
    updateUser: builder.mutation<TrelloApi.UserApi.UpdateUserResponse, TrelloApi.UserApi.UpdateUserRequest>({
      query: (data) => ({
        url: `/api/user/${data.email}`,
        body: data,
        method: 'PUT'
      })
    }),
    getUserByEmail: builder.query<TrelloApi.UserApi.GetUserResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/api/user/${email}`,
        method: 'GET'
      })
    }),
    getActivities: builder.query<TrelloApi.UserApi.GetallActivitiesResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/api/activity/${email}`,
        method: 'GET'
      })
    }),
    getWorkspaceById: builder.query<TrelloApi.UserApi.GetUserResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/api/user/workspace/${email}`,
        method: 'GET'
      })
    }),
    getUserById: builder.query<TrelloApi.UserApi.GetUserResponse, string>({
      query: (email_name) => ({
        url: `/api/user/${email_name}`,
        method: 'GET'
      })
    })
  })
})

export { UserApiSlice }
