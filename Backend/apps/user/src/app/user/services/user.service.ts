import { InjectModel } from '@nestjs/mongoose'
import { DbSchemas, TrelloApi } from '@trello-v2/shared'
import { Model } from 'mongoose'

export class UserService {
  constructor(
    @InjectModel(DbSchemas.COLLECTION_NAMES[3])
    private UserMModel: Model<DbSchemas.UserSchema.User>,
    @InjectModel(DbSchemas.COLLECTION_NAMES[5])
    private ActivityMModel: Model<DbSchemas.UserSchema.Activity>,
  ) {}

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
