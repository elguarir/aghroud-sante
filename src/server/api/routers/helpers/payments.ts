import { db } from "@/server/db";

export async function getPayments() {
  return db.payment.findMany({
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });
}
