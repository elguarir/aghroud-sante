import { z } from "zod";

export const ExpenseSchema = z.object({
  label: z.string().optional(),
  amount: z.number({ required_error: "Veuillez remplir ce champ." }),
  expenseDate: z.date({ required_error: "Veuillez remplir ce champ." }),
  type: z.enum([
    "OPERATIONAL",
    "SALARY",
    "EQUIPMENT",
    "UTILITIES",
    "RENT",
    "OTHER",
  ]),
  notes: z.string().optional(),
});

export type Expense = z.infer<typeof ExpenseSchema>;

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
