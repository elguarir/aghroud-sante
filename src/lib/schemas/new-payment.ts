import { z } from "zod";

export const PaymentSchema = z.object({
  patientId: z.number().optional(),
  amount: z.number({ required_error: "Veuillez remplir ce champ." }),
  label: z.string().optional(),
  numberOfSessions: z.number().optional(),
  paymentDate: z.date({ required_error: "Veuillez remplir ce champ." }),
  paymentMethod: z.string().optional(),
  isPaid: z.boolean().default(true).optional(),
  notes: z.string().optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;
