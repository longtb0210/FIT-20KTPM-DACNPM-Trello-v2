import { z } from "zod";

import { BoardLabelSchema, BoardSchema } from "../schemas/Board";
import { emailRegex } from "../utils/regex";

export const BoardIdRequestSchema = BoardSchema.pick({
  _id: true,
});
export type BoardIdRequestGrpc = z.infer<typeof BoardIdRequestSchema>;

export type BoardIdRequest = z.infer<typeof BoardSchema>["_id"];
export type workSpaceIdRequest = z.infer<typeof BoardSchema>["workspace_id"];
export type LabelIdRequest = z.infer<typeof BoardLabelSchema>["_id"];

///

export const GetallBoardRequestSchema = z.object({
  workspace_id: z.string(),
});
export type GetallBoardRequest = z.infer<typeof GetallBoardRequestSchema>;

export const GetallBoardResponseSchema = z.object({
  data: BoardSchema.array(),
});
export type GetallBoardResponse = z.infer<typeof GetallBoardResponseSchema>;

///

export const WorkSpaceIdRequestSchema = BoardSchema.pick({
  workspace_id: true,
});
export type WorkspaceIdRequest = z.infer<typeof WorkSpaceIdRequestSchema>;

export const getBoardsByWorkspaceIdResponseSchema = z.object({
  data: BoardSchema.array(),
});
export type getBoardsByWorkspaceIdResponse = z.infer<typeof GetallBoardResponseSchema>;

///

export const CreateBoardRequestSchema = BoardSchema.pick({
  workspace_id: true,
  name: true,
  visibility: true,
});
export type CreateBoard = z.infer<typeof CreateBoardRequestSchema>;

export const CreateBoardResponseSchema = z.object({
  data: BoardSchema,
});
export type CreateBoardResponse = z.infer<typeof CreateBoardResponseSchema>;

///

export const GetBoardInfoByBoardIdResponseSchema = z.object({
  data: BoardSchema.nullable(),
});
export type GetBoardInfoByBoardIdResponse = z.infer<typeof GetBoardInfoByBoardIdResponseSchema>;

///

export const DeleteBoardResponseSchema = z.object({
  data: BoardSchema.nullable(),
});
export type DeleteBoardResponse = z.infer<typeof DeleteBoardResponseSchema>;

///

export const UpdateBoardRequestSchema = BoardSchema.pick({
  _id: true,
  name: true,
  background: true,
  is_star: true,
  visibility: true,
})
  .partial()
  .required({ _id: true });
export type UpdateBoardRequest = z.infer<typeof UpdateBoardRequestSchema>;

export const UpdateBoardResponseSchema = z.object({
  data: BoardSchema.nullable(),
});
export type UpdateBoardResponse = z.infer<typeof UpdateBoardResponseSchema>;

///

export const AddMemberRequestSchema = BoardSchema.pick({
  _id: true,
})
  .required({ _id: true })
  .merge(
    z.object({
      email: z.string().regex(emailRegex, "Invalid email").default("example@gmail.com"),
    })
  );
export type AddMemberRequest = z.infer<typeof AddMemberRequestSchema>;

export const AddMemberResponseSchema = z.object({
  data: BoardSchema.nullable(),
});
export type AddMemberResponse = z.infer<typeof AddMemberResponseSchema>;

///

export const RemoveMemberRequestSchema = BoardSchema.pick({
  _id: true,
})
  .required({ _id: true })
  .merge(
    z.object({
      email: z.string().regex(emailRegex, "Invalid email").default("example@gmail.com"),
    })
  );
export type RemoveMemberRequest = z.infer<typeof RemoveMemberRequestSchema>;

export const RemoveMemberResponseSchema = z.object({
  data: BoardSchema.nullable(),
});
export type RemoveMemberResponse = z.infer<typeof RemoveMemberResponseSchema>;

///

export const AddWatcherRequestSchema = BoardSchema.pick({
  _id: true,
})
  .required({ _id: true })
  .merge(
    z.object({
      email: z.string().regex(emailRegex, "Invalid email").default("example@gmail.com"),
    })
  );
export type AddWatcherRequest = z.infer<typeof AddWatcherRequestSchema>;

export const AddWatcherResponseSchema = z.object({
  data: BoardSchema.nullable(),
});
export type AddWatcherResponse = z.infer<typeof AddWatcherResponseSchema>;

///

export const RemoveWatcherRequestSchema = BoardSchema.pick({
  _id: true,
})
  .required({ _id: true })
  .merge(
    z.object({
      email: z.string().regex(emailRegex, "Invalid email").default("example@gmail.com"),
    })
  );
export type RemoveWatcherRequest = z.infer<typeof RemoveWatcherRequestSchema>;

export const RemoveWatcherResponseSchema = z.object({
  data: BoardSchema.nullable(),
});
export type RemoveWatcherResponse = z.infer<typeof RemoveWatcherResponseSchema>;

///

export const RemoveBackgroundRequestSchema = BoardSchema.pick({
  background: true,
}).required({ background: true });
export type RemoveBackgroundRequest = z.infer<typeof RemoveBackgroundRequestSchema>;

///

export const GetLabelsResponseSchema = z.object({
  data: BoardLabelSchema.array(),
});
export type GetLabelsResponse = z.infer<typeof GetLabelsResponseSchema>;

///

export const AddLabelRequestSchema = BoardLabelSchema.pick({
  color: true,
  name: true,
}).partial();
export type CreateLabel = z.infer<typeof AddLabelRequestSchema>;

///

export const RemoveLabelRequestSchema = BoardLabelSchema.pick({
  _id: true,
}).required({ _id: true });
export type RemoveLabel = z.infer<typeof RemoveLabelRequestSchema>;

///

export const UpdateLabelRequestSchema = BoardLabelSchema.pick({
  _id: true,
  color: true,
  name: true,
})
  .partial()
  .required({ _id: true });
export type UpdateLabel = z.infer<typeof UpdateLabelRequestSchema>;
