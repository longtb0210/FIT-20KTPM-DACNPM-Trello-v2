import { z } from "zod";

import { MemberSchema, WorkspaceSchema } from "../schemas/Workspace";

export const EmailIdSchema = z.object({
  email: z.string().nullish(),
});

export const WorkspaceDeleteResponeSchema = z.object({
  data: z.object({
    workspace_id: z.string().nullish(),
  }),
});

export type WorkspaceDeleteRespone = z.infer<
  typeof WorkspaceDeleteResponeSchema
>;

export type EmailIdType = z.infer<typeof EmailIdSchema>;

export const WorkspaceIdRequestSchema = WorkspaceSchema.pick({
  _id: true,
});

export type WorkspaceIdRequest = z.infer<typeof WorkspaceIdRequestSchema>;

//res list workspaces
export const WorkspaceListResponseSchema = z.object({
  data: WorkspaceSchema.array(),
});
export type WorkspaceListResponse = z.infer<typeof WorkspaceListResponseSchema>;

//res workspace
export const WorspaceResponseSchema = z.object({
  data: WorkspaceSchema,
});
export type WorspaceResponse = z.infer<typeof WorspaceResponseSchema>;

//res workspace by email
export const WorspaceListByEmailResponseSchema = z.object({
  data: z.object({
    owner: WorkspaceSchema.array(),
    admin: WorkspaceSchema.array(),
    member: WorkspaceSchema.array(),
    guest: WorkspaceSchema.array(),
  }),
});
export type WorspaceListByEmailResponse = z.infer<
  typeof WorspaceListByEmailResponseSchema
>;

//req create workspace
export const CreateWorkspaceRequestSchema = WorkspaceSchema.pick({
  name: true,
  description: true,
  members_email: true,
});
export type CreateWorspaceRequest = z.infer<
  typeof CreateWorkspaceRequestSchema
>;

//req update workspace
export const UpdateWorkspaceInfoRequestSchema = WorkspaceSchema.omit({
  type_id: true,
  members_email: true,
  visibility: true,
}).partial();
export type UpdateWorkspaceInfoRequest = z.infer<
  typeof UpdateWorkspaceInfoRequestSchema
>;

//req change workspace visibility
export const ChangeWorkspaceVisibilityRequestSchema = WorkspaceSchema.pick({
  _id: true,
  visibility: true,
});
export type ChangeWorkspaceVisibilityRequest = z.infer<
  typeof ChangeWorkspaceVisibilityRequestSchema
>;

//
export const InviteMembers2WorkspaceRequestSchema = z.object({
  members: MemberSchema.omit({ _id: true }).array(),
});
export type InviteMembers2WorkspaceRequest = z.infer<
  typeof InviteMembers2WorkspaceRequestSchema
>;
