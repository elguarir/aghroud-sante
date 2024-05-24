import { Payment } from "@prisma/client";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  {
    name: "Patient",
    uid: "patient",
  },
  { name: "Libellé", uid: "label", sortable: true },
  { name: "Montant", uid: "amount", sortable: true },
  { name: "Méthode de paiement", uid: "paymentMethod" },
  { name: "Payé", uid: "isPaid" },
  { name: "Notes", uid: "notes" },
  { name: "Date de paiement", uid: "paymentDate", sortable: true },
  { name: "Nombre des séances", uid: "numberOfSessions", sortable: true },
  { name: "Actions", uid: "actions" },
];

export type PaymentData = Payment & {
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    phoneNumber: string | null;
  } | null;
};

const paymentMethods = [
  { value: "cash", label: "Espèces" },
  { value: "transfer", label: "Virement" },
  { value: "check", label: "Chèque" },
  { value: "other", label: "Other" },
];

export { columns, paymentMethods };
