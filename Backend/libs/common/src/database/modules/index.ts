import { MongooseModule } from '@nestjs/mongoose'
import { DbSchemas } from '@trello-v2/shared'

import * as ActivityMSchema from './Activity.schema'
import * as BoardMSchema from './Board.schema'
import * as CardlistMSchema from './Cardlist.schema'
import * as UserMschema from './User.schema'
import * as WorkspaceMschema from './Workspace.schema'

export const CardlistMModule = MongooseModule.forFeature([
  {
    name: DbSchemas.COLLECTION_NAMES[0],
    schema: CardlistMSchema.CardlistMSchema,
  },
])

export const BoardMModule = MongooseModule.forFeature([
  {
    name: DbSchemas.COLLECTION_NAMES[1],
    schema: BoardMSchema.BoardMSchema,
  },
])

export const WorkspaceMModule = MongooseModule.forFeature([
  {
    name: DbSchemas.COLLECTION_NAMES[2],
    schema: WorkspaceMschema.WorkspaceMSchema,
  },
])

export const MemberMModule = MongooseModule.forFeature([
  {
    name: DbSchemas.COLLECTION_NAMES[4],
    schema: WorkspaceMschema.MemberMSchema,
  },
])

export const UserMModule = MongooseModule.forFeature([
  {
    name: DbSchemas.COLLECTION_NAMES[3],
    schema: UserMschema.UserMSchema,
  },
])

export const CardMModule = MongooseModule.forFeature([
  {
    name: DbSchemas.COLLECTION_NAMES[6],
    schema: CardlistMSchema.CardMSchema,
  },
])
export { ActivityMSchema, CardlistMSchema, BoardMSchema, WorkspaceMschema, UserMschema }
