import { z } from "zod";

export const AppointmentSchema = z.object({
  patientId: z.number({ required_error: "Veuillez remplir ce champ." }),
  therapistId: z.string().optional(),
  serviceId: z.string().optional(),
  startTime: z.date({ required_error: "Veuillez remplir ce champ." }),
  endTime: z.date({ required_error: "Veuillez remplir ce champ." }),
  floor: z.number().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  notes: z.string().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;
