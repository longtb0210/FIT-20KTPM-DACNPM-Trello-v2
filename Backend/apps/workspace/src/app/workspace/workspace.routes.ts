import { IRouteParams } from '@app/common/decorators'
import { HttpStatus, RequestMethod } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'

export default {
  index: '/api/workspace',
  getAll: <IRouteParams>{
    path: '',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponse') }, isArray: true }],
    },
  },
  getWorkspaceById: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('') }, isArray: true }],
    },
  },
  getAllWorkspacesByEmail: <IRouteParams>{
    path: '/all',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponse') }, isArray: true }],
    },
  },
  getOwnerWorkspacesByEmail: <IRouteParams>{
    path: '/role/owner',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponse') }, isArray: true }],
    },
  },
  getAdminWorkspacesByEmail: <IRouteParams>{
    path: '/role/admin',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponse') }, isArray: true }],
    },
  },
  getMemberWorkspacesByEmail: <IRouteParams>{
    path: '/role/member',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponse') }, isArray: true }],
    },
  },
  getGuestWorkspacesByEmail: <IRouteParams>{
    path: '/role/guest',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponse') }, isArray: true }],
    },
  },
  getPendingWorkspacesByEmail: <IRouteParams>{
    path: '/role/pending',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponse') }, isArray: true }],
    },
  },
  createWorkspace: <IRouteParams>{
    path: '',
    method: RequestMethod.POST,
    swaggerInfo: {
      body: {
        schema: { $ref: getSchemaPath('CreateWorkspaceRequestSchema') },
      },
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('CreateWorkspaceResponseSchema') } }],
    },
  },
  updateWorkspaceInfo: <IRouteParams>{
    path: '',
    method: RequestMethod.PUT,
    swaggerInfo: {
      body: {
        schema: { $ref: getSchemaPath('UpdateWorkspaceInfoRequestSchema') },
      },
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('UpdateWorkspaceInfoResponseSchema') } }],
    },
  },
  changeWorkspaceVisibility: <IRouteParams>{
    path: '/visibility',
    method: RequestMethod.PUT,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('UpdateWorkspaceInfoResponseSchema') } }],
    },
  },
  deleteWorkspaceById: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, type: String }],
    },
  },
  inviteMembers2Workspace: <IRouteParams>{
    path: '/invite/:id',
    method: RequestMethod.POST,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, type: String }],
    },
  },
}
