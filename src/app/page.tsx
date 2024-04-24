import { LoginForm } from "@/components/login-form";
import { ThemeSwitch } from "@/components/theme-switch";

export default async function Home() {
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
