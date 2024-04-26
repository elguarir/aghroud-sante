import { z } from "zod";

export const generalInfoSchema = z.object({
  avatarUrl: z.string().optional(),
  name: z.string({ required_error: "Please fill out this field." }),
  email: z.string({ required_error: "Please fill out this field." }).email(),
  phoneNumber: z.string().optional(),
});
