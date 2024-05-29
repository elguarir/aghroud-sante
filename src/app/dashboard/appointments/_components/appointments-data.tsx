import { RouterOutput } from "@/server/api/root";
import { CheckIcon, ClockIcon, CrossCircledIcon } from "@radix-ui/react-icons";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  {
    name: "Patient",
    uid: "patient",
  },
  { name: "Médecin", uid: "therapist" },
  { name: "Service", uid: "service" },
  { name: "Temps", uid: "startTime", sortable: true },
  { name: "Étage", uid: "floor" },
  { name: "Statut", uid: "status" },
  { name: "Notes", uid: "notes" },
  { name: "Actions", uid: "actions" },
];
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
    icon: <CheckIcon className="h-4 w-4" />,
  },
  {
    label: "Annulé",
    color: "danger",
    value: "CANCELLED",
    icon: <CrossCircledIcon className="h-4 w-4" />,
  },
] as const;
export type AppointmentsData = RouterOutput["appointment"]["all"][number];

export { columns };
