import { z } from "zod";
import { CardSchema, CardlistSchema } from "../schemas/CardList";
import { Refine_MongoId } from "../utils/RefineMongoId";

export const CreateCardlistRequestSchema = CardlistSchema.omit({
  _id: true,
  cards: true,
}).merge(
  z.object({
    index: z.number().default(0),
  })
);
export type CreateCardlistRequest = z.infer<typeof CreateCardlistRequestSchema>;

export type CopyCardlistRequest = z.infer<typeof CopyCardlistRequestSchema>;

export const CopyCardlistRequestSchema = CardlistSchema.required({
  _id: true,
  created_by: true,
})
  .pick({
    _id: true,
    created_at: true,
  })
  .merge(
    z.object({
      created_by: z.string().default(""),
    })
  );

//name, archive date, index
export const UpdateCardlistRequestSchema = CardlistSchema.omit({
  board_id: true,
  cards: true,
  watcher_email: true,
  created_at: true,
}).merge(
  z.object({
    index: z.number().optional(),
    archive_at: z.coerce.date().optional(),
    name: z.string().optional(),
  })
);
export type UpdateCardlistRequest = z.infer<typeof UpdateCardlistRequestSchema>;

export const AddWatcherRequestSchema = CardlistSchema.omit({
  board_id: true,
  index: true,
  name: true,
  cards: true,
  watcher_email: true,
  archive_at: true,
  created_at: true,
}).merge(
  z.object({
    email: z.string(),
  })
);
export type AddWatcherRequest = z.infer<typeof AddWatcherRequestSchema>;

export const RemoveWatcherRequestSchema = CardlistSchema.omit({
  board_id: true,
  index: true,
  name: true,
  cards: true,
  watcher_email: true,
  archive_at: true,
  created_at: true,
}).merge(
  z.object({
    watcher: z.string(),
  })
);
export type RemoveWatcherRequest = z.infer<typeof RemoveWatcherRequestSchema>;

export const MoveCardlistRequestSchema = CardlistSchema.omit({
  board_id: true,
  name: true,
  cards: true,
  watcher_email: true,
  created_at: true,
  archive_at: true,
}).merge(
  z.object({
    index: z.number(),
    board_id: z.string(),
  })
);
export type MoveCardlistRequest = z.infer<typeof MoveCardlistRequestSchema>;
export const MoveCardlistInBoardRequestSchema = CardlistSchema.omit({
  board_id: true,
  name: true,
  cards: true,
  watcher_email: true,
  created_at: true,
  archive_at: true,
}).merge(
  z.object({
    index: z.number(),
  })
);
export type MoveCardlistInBoardRequest = z.infer<
  typeof MoveCardlistInBoardRequestSchema
>;

export const MoveAllCardsRequestSchema = z.object({
  cardlist_input_id: z
    .string()
    .refine(Refine_MongoId, { message: "Invalid id" }),
  cardlist_output_id: z
    .string()
    .refine(Refine_MongoId, { message: "Invalid id" }),
});
export type MoveAllCardsRequest = z.infer<typeof MoveAllCardsRequestSchema>;

export const AddCardToListRequestSchema = CardSchema.omit({
  _id: true,
  archive_at: true,
  activities: true,
  features: true,
  created_at: true,
}).merge(
  z.object({
    index: z.number().default(0),
    cardlist_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  })
);
export type AddCardToListRequest = z.infer<typeof AddCardToListRequestSchema>;

export const CloneCardlistsToNewBoardRequestSchema = z.object({
  board_input_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  board_output_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
});
export type CloneCardlistsToNewBoardRequest = z.infer<
  typeof CloneCardlistsToNewBoardRequestSchema
>;
export const DeleteCardlistsByBoardIdRequestSchema = z.object({
  board_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
});
export type DeleteCardlistsByBoardIdRequest = z.infer<
  typeof DeleteCardlistsByBoardIdRequestSchema
>;

export const CloneCardlistsToNewBoardResponseSchema = z.object({
  data: CardlistSchema.array(),
});
export type CloneCardlistsToNewBoardResponse = z.infer<
  typeof GetallCardlistResponseSchema
>;
export const AddCardToListResponseSchema = z.object({
  data: CardlistSchema,
});
export type AddCardToListResponse = z.infer<typeof AddCardToListResponseSchema>;
export const CreateCardlistResponseSchema = z.object({
  data: CardlistSchema,
});
export type CreateCardlistResponse = z.infer<
  typeof CreateCardlistResponseSchema
>;

export const CopyCardlistResponseSchema = z.object({
  data: CardlistSchema,
});
export type CopyCardlistResponse = z.infer<typeof CopyCardlistResponseSchema>;

export const ArchiveAllCardsInListResponseSchema = z.object({
  data: CardlistSchema,
});
export type ArchiveAllCardsInListResponse = z.infer<
  typeof ArchiveAllCardsInListResponseSchema
>;

export const ArchiveCardlistResponseSchema = z.object({
  data: CardlistSchema,
});
export type ArchiveCardlistResponse = z.infer<
  typeof ArchiveCardlistResponseSchema
>;

export const UpdateCardlistResponseSchema = z.object({
  data: CardlistSchema,
});
export type UpdateCardlistResponse = z.infer<
  typeof UpdateCardlistResponseSchema
>;

export const AddWatcherResponseSchema = z.object({
  data: CardlistSchema,
});
export type AddWatcherResponse = z.infer<typeof AddWatcherResponseSchema>;

export const RemoveWatcherResponseSchema = z.object({
  data: CardlistSchema,
});
export type RemoveWatcherResponse = z.infer<typeof RemoveWatcherResponseSchema>;

export const MoveCardlistResponseSchema = z.object({
  data: CardlistSchema,
});
export type MoveCardlistResponse = z.infer<typeof MoveCardlistResponseSchema>;
export const MoveCardlistInBoardResponseSchema = z.object({
  data: CardlistSchema,
});
export type MoveCardlistInBoardResponse = z.infer<
  typeof MoveCardlistInBoardResponseSchema
>;
export const MoveAllCardsResponseSchema = z.object({
  data: CardlistSchema,
});
export type MoveAllCardsResponse = z.infer<typeof MoveAllCardsResponseSchema>;

export const GetallCardlistResponseSchema = z.object({
  data: CardlistSchema.array(),
});
export type GetallCardlistResponse = z.infer<
  typeof GetallCardlistResponseSchema
>;

export const GetallCardlistByBoardIdResponseSchema = z.object({
  data: CardlistSchema.array(),
});
export type GetallCardlistByBoardIdResponse = z.infer<
  typeof GetallCardlistByBoardIdResponseSchema
>;

export const GetallCardlistArchivedByBoardIdResponseSchema = z.object({
  data: CardlistSchema.array(),
});
export type GetallCardlistArchivedByBoardIdResponse = z.infer<
  typeof GetallCardlistArchivedByBoardIdResponseSchema
>;

export const GetallCardlistNonArchivedByBoardIdResponseSchema = z.object({
  data: CardlistSchema.array(),
});
export type GetallCardlistNonArchivedByBoardIdResponse = z.infer<
  typeof GetallCardlistNonArchivedByBoardIdResponseSchema
>;

export const SortCardlistByOldestDateResponseSchema = z.object({
  data: CardlistSchema.array(),
});
export type SortCardlistByOldestDateResponse = z.infer<
  typeof SortCardlistByOldestDateResponseSchema
>;

export const SortCardlistByNewestDateResponseSchema = z.object({
  data: CardlistSchema.array(),
});
export type SortCardlistByNewestDateResponse = z.infer<
  typeof SortCardlistByNewestDateResponseSchema
>;

export const SortCardlistByNameResponseSchema = z.object({
  data: CardlistSchema.array(),
});
export type SortCardlistByNameResponse = z.infer<
  typeof SortCardlistByNameResponseSchema
>;

export const SortCardByOldestDateResponseSchema = z.object({
  data: CardlistSchema,
});
export type SortCardByOldestDateResponse = z.infer<
  typeof SortCardByOldestDateResponseSchema
>;

export const SortCardByNewestDateResponseSchema = z.object({
  data: CardlistSchema,
});
export type SortCardByNewestDateResponse = z.infer<
  typeof SortCardByNewestDateResponseSchema
>;

export const SortCardByNameResponseSchema = z.object({
  data: CardlistSchema,
});
export type SortCardByNameResponse = z.infer<
  typeof SortCardByNameResponseSchema
>;

export const BoardIdRequestParamsSchema = z.object({
  board_id: z.string(),
});
export type BoardIdRequestParams = z.infer<typeof BoardIdRequestParamsSchema>;
