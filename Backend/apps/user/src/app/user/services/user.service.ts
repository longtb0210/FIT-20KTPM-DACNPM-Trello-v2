import { InjectModel } from '@nestjs/mongoose'
import { DbSchemas, TrelloApi } from '@trello-v2/shared'
import { Model } from 'mongoose'

export abstract class IUserService {

  abstract createUser(data: TrelloApi.UserApi.CreateUserRequest)

  abstract getAllUser()

  abstract getUser(email: string)

  abstract updateUser(email: string, data: TrelloApi.UserApi.UpdateUserRequest)

  abstract deleteUser(email: string)

  abstract createActivity(email: string, data: TrelloApi.UserApi.CreateActivityRequest)

  abstract getAllActivities(email: string)

  abstract deleteActivity(email: string, id: number | string)

  abstract deleteActivities(email: string)
}
export class UserService implements IUserService {
  constructor(
    @InjectModel(DbSchemas.COLLECTION_NAMES[3])
    private UserMModel: Model<DbSchemas.UserSchema.User>,
    @InjectModel(DbSchemas.COLLECTION_NAMES[5])
    private ActivityMModel: Model<DbSchemas.UserSchema.Activity>,
  ) { }

  async createUser(data: TrelloApi.UserApi.CreateUserRequest) {
    const model = new this.UserMModel(data)
    return model.save()
  }

  async getAllUser() {
    return this.UserMModel.find().exec()
  }

  async getUser(email: string) {
    return this.UserMModel.findOne({ email })
  }

  async updateUser(email: string, data: TrelloApi.UserApi.UpdateUserRequest) {
    const user = await this.UserMModel.findOneAndUpdate(
      {
        email,
      },
      data,
      { upsert: true, new: true },
    )

    if (!user) return null

    return user.toJSON()
  }

  async deleteUser(email: string) {
    return await this.UserMModel.findOneAndDelete({
      email,
    }).exec()
  }

  async createActivity(email: string, data: TrelloApi.UserApi.CreateActivityRequest) {
    const model = new this.ActivityMModel(data)

    await this.UserMModel.updateOne({ email }, { $push: { activities: model } }, { upsert: true })

    return model.save()
  }

  async getAllActivities(email: string) {
    return this.UserMModel.findOne({ email }, undefined, { upsert: true }).select('activities')
  }

  async deleteActivity(email: string, id: number | string) {
    const result = await this.ActivityMModel.findOneAndDelete({
      _id: id.toString(),
    }).exec()

    await this.UserMModel.updateOne({ email }, { $pull: { activities: { _id: id } } })

    return result
  }

  async deleteActivities(email: string) {
    const user = await this.UserMModel.findOneAndUpdate(
      {
        email,
      },
      { activities: [] },
      { upsert: true, new: true },
    )

    if (!user) return null

    return user
  }
}

export class UserServiceMock implements IUserService {
  createUser(data: TrelloApi.UserApi.CreateUserRequest) {
    return new Promise<DbSchemas.UserSchema.User>((res) => {
      res({
        activities: [],
        ...data,
        workspace_ids: [],
      })
    })
  }

  getAllUser() {
    return new Promise<DbSchemas.UserSchema.User[]>((res) => {
      res([])
    })
  }

  getUser(email: string) {
    return new Promise<DbSchemas.UserSchema.User>((res) => {
      res({
        email,
        username: 'any_username',
        bio: 'any_bio',
        avatar: 'any_avatar',
        activities: [],
        workspace_ids: [],
      })
    })
  }

  updateUser(email: string, data: TrelloApi.UserApi.UpdateUserRequest) {
    return new Promise<DbSchemas.UserSchema.User>((res) => {
      res({
        ...data,
        email
      })
    })
  }

  deleteUser(email: string) {
    return new Promise<DbSchemas.UserSchema.User>((res) => {
      res({
        email,
        username: 'any_username',
        bio: 'any_bio',
        avatar: 'any_avatar',
        activities: [],
        workspace_ids: [],
      })
    })
  }

  createActivity(email: string, data: TrelloApi.UserApi.CreateActivityRequest) {
    return new Promise<DbSchemas.UserSchema.Activity>((res) => {
      res({
        workspace_id: 'any_workspace_id',
        board_id: 'any_board_id',
        cardlist_id: 'any_cardlist_id',
        card_id: 'any_card_id',
        content: 'any_content'
      })
    })
  }

  getAllActivities(email: string) {
    return new Promise<DbSchemas.UserSchema.Activity[]>((res) => {
      res([])
    })
  }

  deleteActivity(email: string, id: string | number) {
    return new Promise<DbSchemas.UserSchema.Activity>((res) => {
      res({
        workspace_id: 'any_workspace_id',
        board_id: 'any_board_id',
        cardlist_id: 'any_cardlist_id',
        card_id: 'any_card_id',
        content: 'any_content'
      })
    })
  }

  deleteActivities(email: string) {
    return new Promise<DbSchemas.UserSchema.User>((res) => {
      res({
        email,
        username: 'any_username',
        bio: 'any_bio',
        avatar: 'any_avatar',
        activities: [],
        workspace_ids: [],
      })
    })
  }
}