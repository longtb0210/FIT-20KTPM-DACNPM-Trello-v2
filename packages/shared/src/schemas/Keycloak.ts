import { z } from "zod";

export const KeycloakUserBasicInfoSchema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});
export type KeycloakUserBasicInfo = z.infer<typeof KeycloakUserBasicInfoSchema>;
