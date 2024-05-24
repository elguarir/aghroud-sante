import { z } from "zod";

export const TherapistSchema = z.object({
  name: z
    .string({ required_error: "Veuillez remplir ce champ." })
    .min(2, "Le nom doit contenir au moins 2 caractères."),
  speciality: z.string().optional(),
  image: z.string().optional(),
});

export type Therapist = z.infer<typeof TherapistSchema>;
