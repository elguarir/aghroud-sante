import { z } from "zod";

export const passwordChangeSchema = z.object({
  oldPassword: z.string({ required_error: "Please fill out this field." }),
  newPassword: z.string({ required_error: "Please fill out this field." }),
});
