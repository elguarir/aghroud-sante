import { z } from "zod";

export const PatientSchema = z.object({
  firstName: z
    .string({ required_error: "Veuillez remplir ce champ." })
    .min(2, "Le prénom doit contenir au moins 2 caractères."),
  lastName: z
    .string({ required_error: "Veuillez remplir ce champ." })
    .min(2, "Le nom doit contenir au moins 2 caractères."),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  insuranceProvider: z.string().optional(),
  notes: z.string().optional(),
  documents: z.array(
    z.object({
      name: z.string(),
      key: z.string(),
      contentType: z.string(),
      fileSize: z.number(),
    }),
  ),
});

export type Patient = z.infer<typeof PatientSchema>;
