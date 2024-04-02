import { IRouteParams } from '@app/common/decorators'
import { RequestMethod } from '@nestjs/common'

export default {
  index: '/api/board',
  getAllBoard: {
    path: '/',
    method: RequestMethod.GET,
  } as IRouteParams,

  getBoardsByWorkspaceId: {
    path: '/workspace/:workspace_id',
    method: RequestMethod.GET,
  } as IRouteParams,

  createBoard: {
    path: '/',
    method: RequestMethod.POST,
  } as IRouteParams,

  getBoardInfoByBoardId: {
    path: '/:board_id',
    method: RequestMethod.GET,
  } as IRouteParams,

  deleteBoard: {
    path: '/:board_id',
    method: RequestMethod.DELETE,
  } as IRouteParams,

  updateBoard: {
    path: '/',
    method: RequestMethod.PATCH,
  } as IRouteParams,

  addMember: {
    path: '/members/add',
    method: RequestMethod.POST,
  } as IRouteParams,

  removeMember: {
    path: '/members/remove',
    method: RequestMethod.POST,
  } as IRouteParams,

  addWatcher: {
    path: '/watchers/add',
    method: RequestMethod.POST,
  } as IRouteParams,

  removeWatcher: {
    path: '/watchers/remove',
    method: RequestMethod.POST,
  } as IRouteParams,

  addBackground: {
    path: '/:board_id/background_list/add',
    method: RequestMethod.POST,
  } as IRouteParams,

  removeBackground: {
    path: '/:board_id/background_list/remove',
    method: RequestMethod.POST,
  } as IRouteParams,

  getLabels: {
    path: '/:board_id/label',
    method: RequestMethod.GET,
  } as IRouteParams,

  createLabel: {
    path: '/:board_id/label/add',
    method: RequestMethod.POST,
  } as IRouteParams,

  deleteLabel: {
    path: '/:board_id/label/remove',
    method: RequestMethod.POST,
  } as IRouteParams,

  updateLabel: {
    path: '/:board_id/label',
    method: RequestMethod.PATCH,
  } as IRouteParams,
} as const
