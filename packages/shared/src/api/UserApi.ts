import { z } from "zod";

import { ActivitySchema } from "../schemas/Activity";
import { UserSchema } from "../schemas/User";

// create user
export const CreateUserRequestSchema = UserSchema.omit({
  _id: true,
  activities: true,
  workspace_ids: true,
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const CreateUserResponseSchema = z.object({
  data: UserSchema,
});
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

// get all user
export const GetallUserResponseSchema = z.object({
  data: UserSchema.array(),
});
export type GetallUserResponse = z.infer<typeof GetallUserResponseSchema>;

// get user
export const GetUserResponseSchema = z.object({
  data: UserSchema,
});
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

// update user
export const UpdateUserRequestSchema = UserSchema.omit({
  _id: true,
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const UpdateUserResponseSchema = z.object({
  data: UserSchema,
});
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

export const UpdateUserRequestSchemaProto = UserSchema;
export type UpdateUserRequestProto = z.infer<
  typeof UpdateUserRequestSchemaProto
>;

// delete user
export const DeleteUserResponseSchema = z.object({
  data: UserSchema,
});
export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;

// create activity
export const CreateActivityRequestSchema = ActivitySchema.omit({
  _id: true,
});

export type CreateActivityRequest = z.infer<typeof CreateActivityRequestSchema>;

export const CreateActivityResponseSchema = z.object({
  data: ActivitySchema,
});
export type CreateActivityResponse = z.infer<
  typeof CreateActivityResponseSchema
>;

// get all activities
export const GetallActivitiesResponseSchema = z.object({
  data: ActivitySchema.array().nullable(),
});
export type GetallActivitiesResponse = z.infer<
  typeof GetallActivitiesResponseSchema
>;

// delete activity
export const DeleteActivityResponseSchema = z.object({
  data: ActivitySchema,
});
export type DeleteActivityResponse = z.infer<
  typeof DeleteActivityResponseSchema
>;

// delete activities
export const DeleteActivitiesResponseSchema = z.object({
  data: UserSchema,
});
export type DeleteActivitiesResponse = z.infer<
  typeof DeleteActivitiesResponseSchema
>;
