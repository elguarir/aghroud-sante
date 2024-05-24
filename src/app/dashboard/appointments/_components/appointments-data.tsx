import { RouterOutput } from "@/server/api/root";

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
export type AppointmentsData = RouterOutput["appointment"]["all"][number];

export { columns };
