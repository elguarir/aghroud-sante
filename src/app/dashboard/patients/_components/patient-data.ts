import { Patient } from "@prisma/client";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  {
    name: "Patient",
    uid: "patient",
  },
  { name: "Date de naissance", uid: "dateOfBirth", sortable: true },
  { name: "Numéro de téléphone", uid: "phoneNumber" },
  { name: "Adresse", uid: "address" },
  { name: "Assurance", uid: "insuranceProvider" },
  { name: "Notes", uid: "notes" },
  { name: "Inscrit le", uid: "createdAt", sortable: true },
  { name: "Nombre d'appointements", uid: "appointmentsCount", sortable: true },
  { name: "Actions", uid: "actions" },
];

export type PatientData = Patient & {
  appointmentsCount: number;
};

export { columns };
