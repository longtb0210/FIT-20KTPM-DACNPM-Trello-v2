import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJJeTRaRVRpQVp3OUwtN1hQQWJPN1RxclNjYW9EN1pNQVNTSUNRWEVsLTBzIn0.eyJleHAiOjE3MTE5MTYzNTgsImlhdCI6MTcxMTg4MDM1OCwianRpIjoiNDlmMzg4OGUtNjk5Ni00MDI3LTgzM2YtMGY4Mjg3MjZjNDkxIiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlY2Q0NWQ1ZS03NGY2LTRmYjctYjk4NS0yYjdkYWViYWQzZmMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiYjk2ZGFkNzAtNjZmMC00ZDEzLWE4MGUtODRhMzlhYzZlZjI2IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3d3dy5rZXljbG9hay5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXRyZWxsbyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImI5NmRhZDcwLTY2ZjAtNGQxMy1hODBlLTg0YTM5YWM2ZWYyNiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVGluIFRyYW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0aW4xMjMiLCJnaXZlbl9uYW1lIjoiVGluIiwiZmFtaWx5X25hbWUiOiJUcmFuIiwiZW1haWwiOiJib3RvbXRpbmxvbkBnbWFpbC5jb20ifQ.YsVfsQk5aRh9s-fe7pR6P0ngnMTUjUNZqUgmLsr6-f4_VybedraT9sQ24Izg3lUSFvXAmHu4WCoaLaZidBZyZyq_p5sEGhsAmrVja0GHSimlRvaTnswLnExPZwrzuP2cGS-QjvJexkGjhB2b1Zx9AjWI8686uiv0LERcmDeIHwmWvvjgJXnbbLPu8HBE13yzMma7wPY2HbomkcIn9t1FZQr3dg9ABGabHrpw6QYdcZPBIWTRD3pb0v86h4ij3lAJMD6M8ummwJPd9kkNR2OJ8rH7MERRW5MH5SJKrYsrST5MJsB9tK7wZcfidbTG_waI16YznSWZ2OSFEEigoWyqFg'

const UserApiSlice = createApi({
  reducerPath: 'UserdApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:10000',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  endpoints: (builder) => ({
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
        url: `/api/user/${email}`,
        method: 'GET'
      })
    }),
    getWorkspaceById: builder.query<TrelloApi.UserApi.GetUserResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/api/user/workspace/${email}`,
        method: 'GET'
      })
    })
  })
})

export { UserApiSlice }
