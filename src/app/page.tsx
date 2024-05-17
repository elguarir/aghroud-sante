import { LoginForm } from "@/components/login-form";
import { ThemeSwitch } from "@/components/theme-switch";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) return redirect("/dashboard");
  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center px-2">
      <div className="absolute right-4 top-4">
        <ThemeSwitch />
      </div>
      <div className="flex w-full max-w-[400px]">
        <LoginForm />
      </div>
    </main>
  );
}
