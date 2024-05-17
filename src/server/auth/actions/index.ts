"use server";
import { signIn, signOut, update } from "@/server/auth";
import { AuthError, Session, User } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "The credentials you provided are incorrect.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export const logout = async (formdata: FormData) => {
  await signOut({ redirectTo: "/" });
};

export async function updateSession(
  data: Partial<
    | Session
    | {
        user: Partial<User | undefined>;
      }
  >,
): Promise<Session | null> {
  return update(data);
}
