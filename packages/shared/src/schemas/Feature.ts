import { z } from "zod";

export const IFeatureSchema = z.object({
  _id: z.string().optional(),
  type: z.string(),
});

export const FeatureLabelSchema = z.object({
  _id: z.string().optional(),
  type: z.literal("label"),
  label_id: z.string(),
});

export const FeatureChecklistSchema = z.object({
  _id: z.string().optional(),
  name: z.string().default(""),
  type: z.literal("checklist"),
  items: z
    .object({ name: z.string(), is_check: z.boolean().default(false) })
    .array(),
});

export const FeatureDateSchema = z.object({
  _id: z.string().optional(),
  type: z.literal("date"),
  start_date: z.coerce.date().optional(),
  due_date: z.coerce.date(),
});

export const FeatureAttachmentSchema = z.object({
  _id: z.string().optional(),

  type: z.literal("attachment"),
  link: z.string(),
});

export const FeatureSchema = z.discriminatedUnion("type", [
  FeatureLabelSchema,
  FeatureChecklistSchema,
  FeatureDateSchema,
  FeatureAttachmentSchema,
]);

export type IFeature = z.infer<typeof IFeatureSchema>;
export type Feature_CardLabel = z.infer<typeof FeatureLabelSchema>;
export type Feature_Attachment = z.infer<typeof FeatureAttachmentSchema>;
export type Feature_Date = z.infer<typeof FeatureDateSchema>;
export type Feature_Checklist = z.infer<typeof FeatureChecklistSchema>;

export type Feature = z.infer<typeof FeatureSchema>;
