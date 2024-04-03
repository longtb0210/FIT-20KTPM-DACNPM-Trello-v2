import { z } from "zod";
import { ActivitySchema } from "./Activity";
import { Feature, FeatureSchema } from "./Feature";
import { Refine_MongoId } from "../utils/RefineMongoId";

export const CardSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: "Invalid id" }).optional(),
  name: z.string(),
  index: z.number().nullish(),
  watcher_email: z.string().array().default([]),
  archive_at: z.coerce.date().nullish(),
  created_at: z.coerce.date().default(new Date()),
  activities: ActivitySchema.array().default([]),
  features: FeatureSchema.array().default([]),
  cover: z.string().nullish(),
  description: z.string().nullish(),
});
export const CardlistSchema = z.object({
  _id: z.string().optional().refine(Refine_MongoId, { message: "Invalid id" }),
  board_id: z.string(),
  index: z.number().nullish(),
  name: z.string(),
  cards: CardSchema.array().default([]),
  watcher_email: z.string().array().default([]),
  archive_at: z.coerce.date().nullish(),
  created_at: z.coerce.date().default(new Date()).nullish(),
});
export type ICard = z.infer<typeof CardSchema>;
export type CardList = z.infer<typeof CardlistSchema>;

export type Card = ICard & { features: Feature[] };
