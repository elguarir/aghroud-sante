import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }
  let hashedPassword = await bcrypt.hash(password, 10);
  let user = await db.user.create({
    data: {
      name: "Lhsen Elguarir",
      image: `https://api.dicebear.com/8.x/initials/svg?fontSize=40&seed=${name}`,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  console.log(user);
  return NextResponse.json({ message: "User created", data: user });
}
