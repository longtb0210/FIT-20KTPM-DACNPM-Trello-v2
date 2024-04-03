import mongoose from 'mongoose'
import { DbSchemas } from '@trello-v2/shared'
import { ActivityMSchema } from './Activity.schema'
const { Schema } = mongoose

export const FeatureMSchema = new Schema<DbSchemas.FeatureSchema.IFeature>(
  {
    type: { type: String, required: true },
  },
  { strict: false },
)

export const CardMSchema = new Schema<DbSchemas.CardlistSchema.Card>({
  name: String,
  index: Number,
  watcher_email: [String],
  archive_at: Date,
  activities: [ActivityMSchema],
  features: [FeatureMSchema],
  created_at: Date,
})

export const CardlistMSchema = new Schema<DbSchemas.CardlistSchema.CardList>({
  board_id: String,
  index: Number,
  name: String,
  cards: [CardMSchema],
  watcher_email: [String],
  archive_at: Date,
  created_at: Date,
})
