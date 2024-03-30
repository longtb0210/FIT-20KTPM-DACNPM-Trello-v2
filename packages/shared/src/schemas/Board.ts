import { z } from "zod";
import { ActivitySchema } from "./Activity";
import { Refine_MongoId } from "../utils/RefineMongoId";

export const BoardLabelSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: "Invalid id" }).optional(),
  color: z.string().default(""),
  name: z.string().default(""),
});

export const BoardSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: "Invalid id" }).optional(),
  name: z.string().default(""),
  workspace_id: z.string().default(""),
  background: z.string().default(""),
  background_list: z.string().array().default([]),
  activities: ActivitySchema.array().default([]),
  members_email: z.string().array().default([]),
  labels: BoardLabelSchema.array().default([]),
  is_star: z.boolean().default(false),
  watcher_email: z.string().array().default([]),
  visibility: z
    .union([z.literal("private"), z.literal("workspace"), z.literal("public")])
    .default("private"),
});
export type BoardLabel = z.infer<typeof BoardLabelSchema>;
export type Board = z.infer<typeof BoardSchema>;
