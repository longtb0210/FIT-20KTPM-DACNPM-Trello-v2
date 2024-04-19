import { z } from "zod";

import { Refine_MongoId } from "../utils/RefineMongoId";

export const ActivitySchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: "Invalid id" }).optional(),
  workspace_id: z.string(),
  board_id: z.string().nullish(),
  cardlist_id: z.string().nullish(),
  card_id: z.string().nullish(),
  content: z.string().default("<b>Some one</b> has update <b>something</b>"),
  create_time: z.coerce.date().default(new Date()),
  creator_email: z.string(),
  is_comment: z.literal<boolean>(true).optional(),
});
export type Activity = z.infer<typeof ActivitySchema>;
