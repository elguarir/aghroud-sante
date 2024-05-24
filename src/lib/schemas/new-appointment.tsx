import {
  CheckCircledIcon,
  ClockIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { nullable, z } from "zod";

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

export const AppointmentStatus = [
  {
    label: "En attente",
    color: "warning",
    value: "PENDING",
    icon: <ClockIcon className="h-4 w-4" />,
  },
  {
    label: "Confirmé",
    color: "success",
    value: "CONFIRMED",
    icon: <CheckCircledIcon className="h-4 w-4" />,
  },
  {
    label: "Annulé",
    color: "danger",
    value: "CANCELLED",
    icon: <CrossCircledIcon className="h-4 w-4" />,
  },
] as const;

/**
 * 
 * enum AppointmentStatus {
    PENDING
    CONFIRMED
    CANCELLED
}

model Appointment {
    id          String            @id @default(cuid())
    patientId   Int               @map("patient_id")
    therapistId String            @map("therapist_id")
    serviceId   String?           @map("service_id")
    startTime   DateTime
    endTime     DateTime
    floor       Int?
    status      AppointmentStatus // pending, confirmed, cancelled: when the patient cancels the appointment or the therapist cancels the appointment or the appointment is cancelled by the management
    createdAt   DateTime          @default(now()) @map("created_at")
    updatedAt   DateTime          @updatedAt @map("updated_at")
    // when the appointment is confirmed, the service is added to the appointment
    service     Service?          @relation(fields: [serviceId], references: [id], onDelete: SetNull)
    patient     Patient           @relation(fields: [patientId], references: [id], onDelete: Cascade)

    @@map("appointments")
}
 */
