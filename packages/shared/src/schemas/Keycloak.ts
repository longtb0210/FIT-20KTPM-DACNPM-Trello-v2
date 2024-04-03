import { z } from "zod";

export const KeycloakUserBasicInfoSchema = z.object({
  name: z.string(),
  preferred_username: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  email: z.string(),
});
export type KeycloakUserBasicInfo = z.infer<typeof KeycloakUserBasicInfoSchema>;
