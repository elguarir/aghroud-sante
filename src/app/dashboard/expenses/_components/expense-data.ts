import { Expense, Payment } from "@prisma/client";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Libellé", uid: "label", sortable: true },
  { name: "Montant", uid: "amount", sortable: true },
  { name: "Type", uid: "type" },
  { name: "Notes", uid: "notes" },
  { name: "Date", uid: "expenseDate", sortable: true },
  { name: "Actions", uid: "actions" },
];

export type ExpenseData = Expense;

export const ExpenseTypes = [
  {
    label: "Opérationnel",
    value: "OPERATIONAL",
  },
  {
    label: "Salaire",
    value: "SALARY",
  },
  {
    label: "Équipement",
    value: "EQUIPMENT",
  },
  {
    label: "Services publics",
    value: "UTILITIES",
  },
  {
    label: "Loyer",
    value: "RENT",
  },
  {
    label: "Autre",
    value: "OTHER",
  },
];

export { columns };

/**
 * 
 * enum ExpenseType {
    OPERATIONAL
    SALARY
    EQUIPMENT
    UTILITIES
    RENT
    OTHER
}

 */
