import { IRouteParams } from '@app/common/decorators'
import { RequestMethod } from '@nestjs/common'

export const CardRoutes = {
  createCard: {
    path: '',
    method: RequestMethod.POST,
    jwtSecure: false,
  } as IRouteParams,
  getAllCardsOfCardlist: {
    path: '',
    method: RequestMethod.GET,
    jwtSecure: false,
  } as IRouteParams,
  getCardDetail: {
    path: 'detail',
    method: RequestMethod.GET,
    jwtSecure: false,
  } as IRouteParams,
  updateCardDetail: {
    path: 'detail',
    method: RequestMethod.PUT,
    jwtSecure: false,
  } as IRouteParams,
  addFeatureToCard: {
    path: 'feature',
    method: RequestMethod.POST,
    jwtSecure: false,
  } as IRouteParams,
  updateFeatureToCard: {
    path: 'feature',
    method: RequestMethod.PUT,
    jwtSecure: false,
  } as IRouteParams,
  addWatcherToCard: {
    path: 'watcher',
    method: RequestMethod.POST,
    jwtSecure: false,
  } as IRouteParams,
  deleteWatcherToCard: {
    path: 'watcher',
    method: RequestMethod.DELETE,
    jwtSecure: false,
  } as IRouteParams,
  archiveCard: {
    path: 'archive',
    method: RequestMethod.POST,
    jwtSecure: false,
  } as IRouteParams,
  unarchiveCard: {
    path: 'archive',
    method: RequestMethod.DELETE,
    jwtSecure: false,
  } as IRouteParams,
  moveCard: {
    path: 'move/same',
    method: RequestMethod.POST,
    jwtSecure: false,
  } as IRouteParams,
} as const
