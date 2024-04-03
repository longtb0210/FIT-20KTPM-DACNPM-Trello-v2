import mongoose from 'mongoose'
import { DbSchemas } from '@trello-v2/shared'
const { Schema } = mongoose

export const ActivityMSchema = new Schema<DbSchemas.ActivitySchema.Activity>({
  workspace_id: { type: String, required: true },
  board_id: String,
  cardlist_id: String,
  card_id: String,
  content: String,
  create_time: Date,
  creator_email: String,
})
