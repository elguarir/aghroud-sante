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

const patients = [
  {
    id: 1,
    firstName: "Tony",
    lastName: "Reichert",
    email: "tony.reichert@example.com",
    dateOfBirth: new Date("1995-03-15"),
    phoneNumber: "+1234567890",
    address: "123 Main St, Cityville",
    notes: "Patient has a history of allergies.",
    insuranceProvider: "CNSS",
    createdAt: new Date("2022-01-01T08:00:00Z"),
    updatedAt: new Date("2022-01-02T10:00:00Z"),
    appointmentsCount: 2,
  },
  {
    id: 2,
    firstName: "Zoey",
    lastName: "Lang",
    email: null,
    dateOfBirth: null,
    phoneNumber: "+1234567890",
    address: "456 Elm St, Townsville",
    notes: "Patient is currently taking medication.",
    insuranceProvider: "CNOPS",
    createdAt: new Date("2022-01-03T09:00:00Z"),
    updatedAt: new Date("2022-01-04T11:00:00Z"),
  },
  // Add more patients here...
] as PatientData[];

export type PatientData = Patient & {
  appointmentsCount: number;
};

export { columns, patients };
