import { IRouteParams } from '@app/common/decorators'
import { HttpStatus, RequestMethod } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'

export default {
  index: '/api/workspace',
  getAll: <IRouteParams>{
    path: '',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
    },
  },
  getWorkspaceById: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
    },
  },
  getAllWorkspacesByEmail: <IRouteParams>{
    path: '/all',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorspaceListByEmailResponseSchema') } }],
    },
  },
  getOwnerWorkspacesByEmail: <IRouteParams>{
    path: '/role/owner',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
    },
  },
  getAdminWorkspacesByEmail: <IRouteParams>{
    path: '/role/admin',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
    },
  },
  getMemberWorkspacesByEmail: <IRouteParams>{
    path: '/role/member',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
    },
  },
  getGuestWorkspacesByEmail: <IRouteParams>{
    path: '/role/guest',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
    },
  },
  getPendingWorkspacesByEmail: <IRouteParams>{
    path: '/role/pending',
    method: RequestMethod.GET,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
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
      body: {
        schema: { $ref: getSchemaPath('ChangeWorkspaceVisibilityRequestSchema') },
      },
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('UpdateWorkspaceInfoResponseSchema') } }],
    },
  },
  deleteWorkspaceById: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorspaceResponseSchema') }, type: String }],
    },
  },
  inviteMembers2Workspace: <IRouteParams>{
    path: '/invite/:id',
    method: RequestMethod.POST,
    swaggerInfo: {
      responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceDeleteResponeSchema') }, type: String }],
    },
  },
}
