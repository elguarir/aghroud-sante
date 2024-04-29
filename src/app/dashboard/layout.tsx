import Link from "next/link";
import { PropsWithChildren } from "react";
import SideBar from "./_components/sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Dashboard({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session || !session.user) {
    return redirect("/");
  }
  return (
    <div className="fixed grid h-screen dark:bg-secondary-400 w-full md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-secondary-400/20 bg-secondary-100/10 dark:border-secondary-700/20 dark:bg-secondary-foreground md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex min-h-[60px] items-center px-4 dark:border-secondary-700/20 md:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 h-full mx-auto w-full">
               <img src="/logo.png" alt="logo"  className="h-28 mx-auto" />
            </Link>
          </div>
          <div className="flex-1">
            <SideBar user={session.user} type="normal" />
          </div>
        </div>
      </div>
      <div className="flex h-screen flex-col">
        <header className="flex h-[60px] items-center gap-4 border-b border-secondary-400/20 bg-secondary-100/10 px-4 dark:border-secondary-700/20 dark:bg-secondary-foreground md:px-6">
          <SideBar user={session.user} type="sheet" />
          <div className="w-full flex-1">
           
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" isIconOnly className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>

        {children}
      </div>
    </div>
  );
}
