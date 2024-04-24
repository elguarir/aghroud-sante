"use server";
import { signIn, signOut } from "@/server/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log("formData", formData);
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
