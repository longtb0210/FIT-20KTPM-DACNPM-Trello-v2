import { ObjectType, Field, ID } from '@nestjs/graphql'
import { ActivitySchema, FeatureSchema } from '@trello-v2/shared/dist/src/schemas'

@ObjectType()
export class Card {
  @Field(() => ID, { nullable: true })
  _id: string

  @Field()
  name: string

  @Field(() => Number, { nullable: true })
  index: number | null

  @Field(() => [String], { defaultValue: [] })
  watcher_email: string[]

  @Field(() => Date, { nullable: true })
  archive_at: Date | null

  @Field(() => Date, { defaultValue: new Date() })
  created_at: Date

  @Field(() => [ActivitySchema], { defaultValue: [] })
  activities: (typeof ActivitySchema)[]

  @Field(() => [FeatureSchema], { defaultValue: [] })
  features: (typeof FeatureSchema)[]

  @Field({ nullable: true })
  cover: string | null

  @Field({ nullable: true })
  description: string | null
}

@ObjectType()
export class Cardlist {
  @Field(() => ID, { nullable: true })
  _id: string

  @Field()
  board_id: string

  @Field(() => Number, { nullable: true })
  index: number | null

  @Field()
  name: string

  @Field(() => [Card], { defaultValue: [] })
  cards: Card[]

  @Field(() => [String], { defaultValue: [] })
  watcher_email: string[]

  @Field(() => Date, { nullable: true })
  archive_at: Date | null

  @Field(() => Date, { defaultValue: new Date(), nullable: true })
  created_at: Date | null
}
