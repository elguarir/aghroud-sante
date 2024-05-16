import { db } from "@/server/db";

export async function getExpenses() {
  return await db.expense.findMany();
}
