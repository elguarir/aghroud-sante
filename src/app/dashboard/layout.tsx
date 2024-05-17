import Link from "next/link";
import { PropsWithChildren } from "react";
import SideBar from "./_components/sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";

export default async function Dashboard({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session || !session.user) {
    return redirect("/");
  }
  return (
    <div className="fixed grid h-screen w-full dark:bg-secondary-400 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-secondary-400/20 bg-secondary-100/10 dark:border-secondary-700/20 dark:bg-secondary-foreground md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex min-h-[60px] items-center px-4 dark:border-secondary-700/20 md:px-6">
            <Link
              href="/dashboard"
              className="mx-auto flex h-full w-full items-center gap-2"
            >
              <img src="/logo.png" alt="logo" className="mx-auto h-28" />
            </Link>
          </div>
          <div className="small custom-scrollbar max-h-[calc(100dvh-40px)] flex-1 overflow-auto">
            <SideBar user={session.user} type="normal" />
          </div>
        </div>
      </div>
      <div className="flex h-screen flex-col">
        <header className="flex h-[60px] items-center gap-4 border-b border-secondary-400/20 bg-secondary-100/10 px-4 dark:border-secondary-700/20 dark:bg-secondary-foreground md:px-6">
          <SideBar user={session.user} type="sheet" />
          <div className="flex w-full flex-1 items-center justify-between">
            <div></div>
            <ThemeSwitch />
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
