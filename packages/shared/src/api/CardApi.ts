import { z } from "zod";
import { CardSchema, CardlistSchema } from "../schemas/CardList";
import { Refine_MongoId } from "../utils/RefineMongoId";
import {
  FeatureAttachmentSchema,
  FeatureChecklistSchema,
  FeatureDateSchema,
  FeatureLabelSchema,
  FeatureSchema,
} from "../schemas/Feature";

//Create card
export const CreateCardRequestSchema = CardSchema.omit({
  _id: true,
  watcher_email: true,
  archive_at: true,
  activities: true,
  features: true,
}).merge(
  z.object({
    index: z.number().default(0),
    cardlist_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  })
);
export type CreateCardRequest = z.infer<typeof CreateCardRequestSchema>;

export const CreateCardRespondSchema = z.object({
  data: CardSchema.required({ _id: true }),
});
export type CreateCardRespond = z.infer<typeof CreateCardRespondSchema>;

//Get all cards info
export const GetAllCardsOfCardlistRequestSchema = z.object({
  cardlist_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
});
export type GetCardsOfCardlistRequest = z.infer<
  typeof GetAllCardsOfCardlistRequestSchema
>;

export const GetAllCardsOfCardlistResponseSchema = z.object({
  data: CardlistSchema.merge(
    z.object({
      cards: CardSchema.required({ _id: true })
        .omit({
          activities: true,
          features: true,
        })
        .array(),
    })
  ),
});
export type GetAllCardsOfCardlistResponse = z.infer<
  typeof GetAllCardsOfCardlistResponseSchema
>;

//Get card detail
export const GetCardDetailRequestSchema = z.object({
  cardlist_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  card_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
});
export type GetCardDetailRequest = z.infer<typeof GetCardDetailRequestSchema>;

export const GetCardDetailResponseSchema = z.object({
  data: CardSchema.required({ _id: true }).nullable(),
});
export type GetCardDetailResponse = z.infer<typeof GetCardDetailResponseSchema>;

// Update card detail
export const UpdateCardDetailRequestSchema = z
  .object({
    cardlist_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
    card_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  })
  .merge(
    CardSchema.partial().pick({
      name: true,
      cover: true,
      description: true,
    })
  );
export type UpdateCardDetailRequest = z.infer<
  typeof UpdateCardDetailRequestSchema
>;
export const UpdateCardDetailResponseSchema = z.object({
  data: CardSchema.required({
    _id: true,
  }),
});

export type UpdateCardDetailResponse = z.infer<
  typeof UpdateCardDetailResponseSchema
>;

//Add card feature
export const AddCardFeatureRequestSchema = z.object({
  card_id: z.string(),
  cardlist_id: z.string(),
  feature: z.discriminatedUnion("type", [
    FeatureLabelSchema.omit({ _id: true }),
    FeatureChecklistSchema.omit({ _id: true }),
    FeatureDateSchema.omit({ _id: true }),
    FeatureAttachmentSchema.omit({ _id: true }),
  ]),
});
export type AddCardFeatureRequest = z.infer<typeof AddCardFeatureRequestSchema>;

export const AddCardFeatureResponseSchema = z.object({
  data: z.discriminatedUnion("type", [
    FeatureLabelSchema.required({ _id: true }),
    FeatureChecklistSchema.required({ _id: true }),
    FeatureDateSchema.required({ _id: true }),
    FeatureAttachmentSchema.required({ _id: true }),
  ]),
});
export type AddCardFeatureResponse = z.infer<
  typeof AddCardFeatureResponseSchema
>;

//Update card feature
export const UpdateCardFeatureRequestSchema = z.object({
  cardlist_id: z.string(),
  card_id: z.string(),
  feature: z.discriminatedUnion("type", [
    FeatureLabelSchema.required({ _id: true }),
    FeatureChecklistSchema.required({ _id: true }),
    FeatureDateSchema.required({ _id: true }),
    FeatureAttachmentSchema.required({ _id: true }),
  ]),
});
export type UpdateCardFeatureRequest = z.infer<
  typeof UpdateCardFeatureRequestSchema
>;

export const UpdateCardFeatureResponseSchema = AddCardFeatureResponseSchema;
export type UpdateCardFeatureResponse = z.infer<
  typeof UpdateCardFeatureResponseSchema
>;

//Add watcher to card
export const AddWatcherToCardRequestSchema = z.object({
  cardlist_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  card_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  watcher_email: z.string(),
});

export type AddWatcherToCardRequest = z.infer<
  typeof AddWatcherToCardRequestSchema
>;

export const AddWatcherToCardResponseSchema = z.object({
  data: CardSchema.required({ _id: true }).omit({
    features: true,
    activities: true,
  }),
});

export type AddWatcherToCardResponse = z.infer<
  typeof AddWatcherToCardResponseSchema
>;

//Delete watcher to card
export const DeleteWatcherToCardRequestSchema = AddWatcherToCardRequestSchema;
export type DeleteWatcherToCardRequest = z.infer<
  typeof DeleteWatcherToCardRequestSchema
>;

export const DeleteWatcherToCardResponseSchema = AddWatcherToCardResponseSchema;
export type DeleteWatcherToCardResponse = z.infer<
  typeof DeleteWatcherToCardResponseSchema
>;

//Archive card
export const ArchiveCardRequestSchema = z.object({
  cardlist_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  card_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
});
export type ArchiveCardRequest = z.infer<typeof ArchiveCardRequestSchema>;

export const ArchiveCardResponseSchema = z.object({
  data: CardSchema.required({ _id: true }).omit({
    features: true,
    activities: true,
  }),
});
export type ArchiveCardResponse = z.infer<typeof ArchiveCardResponseSchema>;

export const UnArchiveCardRequestSchema = ArchiveCardRequestSchema;
export type UnArchiveCardRequest = z.infer<typeof UnArchiveCardRequestSchema>;

export const UnArchiveCardResponseSchema = ArchiveCardResponseSchema;
export type UnArchiveCardResponse = z.infer<typeof ArchiveCardResponseSchema>;

//Move card
export const MoveCardSamelistRequestSchema = z.object({
  cardlist_id: z.string().refine(Refine_MongoId, { message: "Invalid id" }),
  cards_data: z.record(z.coerce.number()),
});
export type MoveCardSamelistRequest = z.infer<
  typeof MoveCardSamelistRequestSchema
>;

export const MoveCardSamelistResponseSchema = z.object({
  data: CardSchema.pick({
    _id: true,
    name: true,
    index: true,
  }).array(),
});
export type MoveCardSamelistResponse = z.infer<
  typeof MoveCardSamelistResponseSchema
>;

// Move card new
export const MoveCardRequestSchema = z.object({
  data: z.object({
    source_list: z.object({
      cardlist_id: z.string(),
      target_card_id: z.string(),
      cards_id_index: z.string().array(),
    }),
    destination_new_list: z
      .object({
        cardlist_id: z.string(),
        cards_id_index: z.string().array(),
      })
      .nullish(),
  }),
});
export const MoveCardResponseSchema = z.object({
  data: CardlistSchema.pick({
    _id: true,
    cards: true,
  }).array(),
});
export type MoveCardRequest = z.infer<typeof MoveCardRequestSchema>;
export type MoveCardResponse = z.infer<typeof MoveCardResponseSchema>;

//Delete feature
export const DeleteFeatureRequestSchema = z.object({
  cardlist_id: z.string(),
  card_id: z.string(),
  feature_id: z.string(),
});
export const DeleteFeatureResponseSchema = z.object({
  data: CardSchema,
});
export type DeleteFeatureRequest = z.infer<typeof DeleteFeatureRequestSchema>;
export type DeleteFeatureResponse = z.infer<typeof DeleteFeatureResponseSchema>;

export const AddCardMemberRequestSchema = z.object({
  cardlist_id: z.string(),
  card_id: z.string(),
  member_email: z.string(),
});
export const AddCardMemberResponseSchema = CardSchema.omit({
  features: true,
}).required({ _id: true });
export type AddCardMemberRequest = z.infer<typeof AddCardMemberRequestSchema>;
export type AddCardMemberResponse = z.infer<typeof AddCardMemberResponseSchema>;

export const DeleteCardMemberRequestSchema = AddCardMemberRequestSchema;
export const DeleteCardMemberResponseSchema = AddCardFeatureResponseSchema;
export type DeleteCardMemberRequest = AddCardMemberRequest;
export type DeleteCardMemberResponse = AddCardMemberResponse;

export const MakeCommentSchemaRequestSchema = z.object({
  card_id: z.string(),
  cardlist_id: z.string(),
  content: z.string(),
});
export type MakeCommentRequest = z.infer<typeof MakeCommentSchemaRequestSchema>;
export const MakeCommentSchemaResponseSchema = z.object({
  data: CardSchema,
});
export type MakeCommentResponse = z.infer<
  typeof MakeCommentSchemaResponseSchema
>;

export const GetAllArchivedCardInBoardRequestSchema = z.object({
  board_id: z.string(),
});
export type getAllArchivedCardInBoardRequest = z.infer<
  typeof GetAllArchivedCardInBoardRequestSchema
>;

export const GetAllArchivedCardInBoardResponseSchema = z.object({
  data: CardSchema.pick({ archive_at: true, _id: true, name: true })
    .required({ _id: true })
    .merge(z.object({ cardlist_id: z.string() }))
    .array(),
});
export type GetAllArchivedCardInBoardResponse = z.infer<
  typeof GetAllArchivedCardInBoardResponseSchema
>;
