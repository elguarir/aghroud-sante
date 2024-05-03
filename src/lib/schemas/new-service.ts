import { z } from "zod";

export const ServiceSchema = z.object({
  name: z
    .string({ required_error: "Veuillez remplir ce champ." })
    .min(2, "Le nom du service doit contenir au moins 2 caractères."),
  description: z.string().optional(),
  price: z.number().optional(),
  duration: z.number().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;

/**
 * model Service {
    id        String   @id @default(cuid())
    name      String
    price     Float?
    duration  Int? // in minutes
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")
    appointments Appointment[]

    @@map("services")
}

 */
