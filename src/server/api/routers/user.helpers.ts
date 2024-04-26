import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function getUserDetails() {
  let session = await auth();
  return await db.user.findUnique({
    where: { id: session?.user?.id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      image: true,
    },
  });
}
