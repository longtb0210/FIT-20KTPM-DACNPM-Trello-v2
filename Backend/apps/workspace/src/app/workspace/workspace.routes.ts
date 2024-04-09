import { IRouteParams } from '@app/common/decorators'
import { RequestMethod } from '@nestjs/common'

export default {
  index: '/api/workspace',
  getAll: <IRouteParams>{
    path: '',
    method: RequestMethod.GET,
  },
  getWorkspaceById: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
  },
  getAllWorkspacesByEmail: <IRouteParams>{
    path: '/all',
    method: RequestMethod.GET,
  },
  getOwnerWorkspacesByEmail: <IRouteParams>{
    path: '/role/owner',
    method: RequestMethod.GET,
  },
  getAdminWorkspacesByEmail: <IRouteParams>{
    path: '/role/admin',
    method: RequestMethod.GET,
  },
  getMemberWorkspacesByEmail: <IRouteParams>{
    path: '/role/member',
    method: RequestMethod.GET,
  },
  getGuestWorkspacesByEmail: <IRouteParams>{
    path: '/role/guest',
    method: RequestMethod.GET,
  },
  getPendingWorkspacesByEmail: <IRouteParams>{
    path: '/role/pending',
    method: RequestMethod.GET,
  },
  createWorkspace: <IRouteParams>{
    path: '',
    method: RequestMethod.POST,
  },
  updateWorkspaceInfo: <IRouteParams>{
    path: '',
    method: RequestMethod.PUT,
  },
  changeWorkspaceVisibility: <IRouteParams>{
    path: '/visibility',
    method: RequestMethod.PUT,
  },
  deleteWorkspaceById: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
  },
  inviteMembers2Workspace: <IRouteParams>{
    path: '/invite/:id',
    method: RequestMethod.POST,
  },
}
