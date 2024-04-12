import * as _ from 'lodash'
import { Model, Types } from 'mongoose'

import { InjectModel } from '@nestjs/mongoose'
import { DbSchemas, TrelloApi } from '@trello-v2/shared'
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage'
import { storage } from 'apps/board/src/firebase'
import { deleteObject, listAll } from 'firebase/storage'
import { v4 } from 'uuid'

export abstract class IBoardService {
  abstract createBoard(data: TrelloApi.BoardApi.CreateBoard): Promise<DbSchemas.BoardSchema.Board>
  abstract getAllBoard(): Promise<DbSchemas.BoardSchema.Board[]>
  abstract getBoardsByWorkspaceId(workspace_id: TrelloApi.BoardApi.workSpaceIdRequest): Promise<DbSchemas.BoardSchema.Board[]>
  abstract getBoardInfoByBoardId(board_id: TrelloApi.BoardApi.BoardIdRequest): Promise<DbSchemas.BoardSchema.Board | null>
  abstract updateBoard(data: DbSchemas.BoardSchema.Board): Promise<DbSchemas.BoardSchema.Board | null>
  abstract deleteBoard(board_id: TrelloApi.BoardApi.BoardIdRequest): Promise<DbSchemas.BoardSchema.Board | null>
  abstract uploadFirebaseImage(imageName: string, imageFile: Express.Multer.File): Promise<string | null>
  abstract removeFirebaseImage(imageUrl: string): Promise<boolean>
  abstract removeFirebaseFolder(board_id: TrelloApi.BoardApi.BoardIdRequest): Promise<boolean>
  abstract createLabel(data: TrelloApi.BoardApi.CreateLabel): Promise<DbSchemas.BoardSchema.BoardLabel>
}

export class BoardService implements IBoardService {
  constructor(
    @InjectModel(DbSchemas.COLLECTION_NAMES[1])
    private BoardMModel: Model<DbSchemas.BoardSchema.Board>,
  ) {}

  async createBoard(data: TrelloApi.BoardApi.CreateBoard) {
    const board = DbSchemas.BoardSchema.BoardSchema.parse(data)
    const model = new this.BoardMModel(board)
    return model.save()
  }

  async getAllBoard() {
    return this.BoardMModel.find().exec()
  }

  async getBoardsByWorkspaceId(workspace_id: string) {
    return await this.BoardMModel.find({ workspace_id: workspace_id }).exec()
  }

  async getBoardInfoByBoardId(board_id: string) {
    return await this.BoardMModel.findById(board_id).exec()
  }

  async updateBoard(data: Partial<DbSchemas.BoardSchema.Board>) {
    const filter = { _id: data._id }
    const update: Partial<DbSchemas.BoardSchema.Board> = _.omitBy(data, (value, key) => _.isUndefined(value) || key === '_id')

    return await this.BoardMModel.findOneAndUpdate(filter, update, {
      new: true,
    })
  }

  async deleteBoard(board_id: string) {
    return await this.BoardMModel.findOneAndDelete({
      _id: board_id,
    }).exec()
  }

  async uploadFirebaseImage(board_id: string, imageFile: Express.Multer.File) {
    const imageRef = ref(storage, `backgrounds/${board_id}/${v4()}.${imageFile.mimetype.split('/')[1]}`)

    try {
      await uploadBytes(imageRef, imageFile.buffer)
      const imageUrl = await getDownloadURL(imageRef)
      return imageUrl
    } catch (error) {
      console.error('Error upload image:', error)
    }
  }

  async removeFirebaseImage(imageUrl: string) {
    const path = decodeURIComponent(imageUrl.split('/o/').pop().split('?alt').shift())
    const imageRef = ref(storage, path)

    try {
      await deleteObject(imageRef)
      return true
    } catch (error) {
      console.error('Error delete image:', error)
      return false
    }
  }

  async removeFirebaseFolder(board_id: string) {
    const path = `backgrounds/${board_id}/`
    const folderRef = ref(storage, path)

    try {
      const folderSnapshot = await listAll(folderRef)
      const filePromises = folderSnapshot.items.map((fileRef) => deleteObject(fileRef))
      await Promise.all(filePromises)
      return true
    } catch (error) {
      console.error('Error deleting folder:', error)
      return false
    }
  }

  async createLabel(data: TrelloApi.BoardApi.CreateLabel) {
    const label = DbSchemas.BoardSchema.BoardLabelSchema.parse(data)
    return label
  }
}

///

export class BoardServiceMock implements IBoardService {
  createBoard(data: TrelloApi.BoardApi.CreateBoard) {
    return new Promise<DbSchemas.BoardSchema.Board>((res) => {
      res({
        ...data,
        _id: new Types.ObjectId().toString(),
        watcher_email: [],
        activities: [],
        members_email: [],
        labels: [],
        is_star: false,
        background: '',
        background_list: [],
      })
    })
  }

  getAllBoard() {
    return new Promise<DbSchemas.BoardSchema.Board[]>((res) => {
      res([])
    })
  }

  getBoardsByWorkspaceId(workspace_id: string) {
    return new Promise<DbSchemas.BoardSchema.Board[]>((res) => {
      res([
        {
          _id: new Types.ObjectId().toString(),
          watcher_email: [],
          activities: [],
          members_email: [],
          labels: [],
          is_star: false,
          workspace_id: workspace_id,
          name: '',
          visibility: 'private',
          background: '',
          background_list: [],
        },
      ])
    })
  }

  getBoardInfoByBoardId(board_id: string) {
    return new Promise<DbSchemas.BoardSchema.Board>((res) => {
      res({
        _id: board_id,
        watcher_email: [],
        activities: [],
        members_email: [],
        labels: [],
        is_star: false,
        workspace_id: new Types.ObjectId().toString(),
        name: '',
        visibility: 'private',
        background: '',
        background_list: [],
      })
    })
  }

  updateBoard(data: DbSchemas.BoardSchema.Board) {
    return new Promise<DbSchemas.BoardSchema.Board>((res) => {
      res({
        ...data,
      })
    })
  }

  deleteBoard(board_id: string) {
    return new Promise<DbSchemas.BoardSchema.Board>((res) => {
      res({
        _id: board_id,
        watcher_email: [],
        activities: [],
        members_email: [],
        labels: [],
        is_star: false,
        workspace_id: new Types.ObjectId().toString(),
        name: '',
        visibility: 'private',
        background: '',
        background_list: [],
      })
    })
  }

  uploadFirebaseImage() {
    return Promise.resolve('Mock-url')
  }

  removeFirebaseImage() {
    return Promise.resolve(true)
  }

  removeFirebaseFolder() {
    return Promise.resolve(true)
  }

  createLabel(data: TrelloApi.BoardApi.CreateLabel) {
    return new Promise<DbSchemas.BoardSchema.BoardLabel>((res) => {
      const label = { _id: new Types.ObjectId().toString(), name: '', color: '' }
      res(
        Object.assign(
          label,
          _.omitBy(data, (value) => _.isUndefined(value)),
        ),
      )
    })
  }
}
