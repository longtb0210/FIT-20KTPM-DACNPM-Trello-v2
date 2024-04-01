import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJSUHBQZ09sTjVINUxiVzQzeFFYcC1jQkVrcFg4SjZMTFJEVUFzN3J1R0JjIn0.eyJleHAiOjE3MTE5Nzk3OTAsImlhdCI6MTcxMTk3Nzk5MCwianRpIjoiMzQwYTdlN2QtNTRiYi00Mzc2LWJkODYtNWRjODA4NzRjYjFlIiwiaXNzIjoiaHR0cHM6Ly8yMDEyNzA0Ny1rZXljbG9hay10cmVsbG8uYXp1cmV3ZWJzaXRlcy5uZXQvcmVhbG1zL3RyZWxsbyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyMzhiOWNjMC03Yjg1LTQzN2EtYTE4MC0zMWQxODRkMTZhYjkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmVsbG8iLCJzZXNzaW9uX3N0YXRlIjoiN2Q5YTRhNmMtZTNiOC00YjZhLWEyZTUtOTliYzUyYzkxMTRkIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtdHJlbGxvIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiN2Q5YTRhNmMtZTNiOC00YjZhLWEyZTUtOTliYzUyYzkxMTRkIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJraW5lIE5ndXllbiIsInByZWZlcnJlZF91c2VybmFtZSI6ImtpbmUxNDEiLCJnaXZlbl9uYW1lIjoia2luZSIsImZhbWlseV9uYW1lIjoiTmd1eWVuIiwiZW1haWwiOiJuZ3V5ZWVua2llZW4xNDFAZ21haWwuY29tIn0.Ra_MNYY2nIBRDHAfTzh09gqBExnuur4BOQ5DowdSpPMQNdrkUxugwZ3MiIRdGWb4wUGideVziTbIowFy_67d2lOBah8v-Id-hsF2YY1Hf0s3ncJ0CB20vsfLU0oSsoxFS1m7tzdV2FAUFmXVPbRgz5DnFOzIfchJdAmojkKU-TtTsXDw45H1J0buzjwh_Tk65fvl0iq41riRsUzXcXgp4hpPsol-yre3yfYGhEa23XDCd2KQtJs20t87GhHuI9_QKjFU3CTdC3tkUWOrc7J1Am5vmtWtwz_9i_ftCnNQXPFPcgdAln0UwixGtstrKK7Fk0Xhu-g-p4YiYGiMOcrufQ'

const WorkspaceApiSlice = createApi({
  reducerPath: 'WorkspaceApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:10000' }),
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.CreateWorspaceRequest
    >({
      query: (data) => ({
        url: '/api/workspace',
        body: data,
        method: 'POST'
      })
    }),
    getAllWorkspace: builder.query<TrelloApi.WorkspaceApi.WorspaceListByEmailResponse, void>({
      query: () => ({
        url: '/api/workspace/all/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }),
    changeVisibility: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest
    >({
      query: () => ({
        url: '/api/workspace/visibility',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }),
    getWorkspaceById: builder.query<TrelloApi.WorkspaceApi.WorspaceResponse, TrelloApi.WorkspaceApi.WorkspaceIdRequest>(
      {
        query: () => ({
          url: '/api/workspace',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
    )
  })
})

export { WorkspaceApiSlice }
