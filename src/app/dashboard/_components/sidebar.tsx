"use client";
import { SidebarMenu } from "./sidebar-menu";
import { SideBarItem, SideBarItemProps } from "./sidebar-item";
import {
  CalendarIcon,
  DashboardIcon,
  InvoicesIcon,
  MoneyInIcon,
  MoneyOutIcon,
  PatientsIcon,
  ReportsIcon,
  ServicesIcon,
  SettingsIcon,
} from "@/components/icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@nextui-org/button";
import { Menu } from "lucide-react";
import { useSheet } from "@/hooks/use-collapsed-store";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import type { User as TUser } from "next-auth";
import { logout } from "@/server/auth/actions";
import LogoutButton from "./logout-button";

type Props = {
  type: "normal" | "sheet";
  user: TUser;
};

const SideBar = ({ type = "normal", user }: Props) => {
  const open = useSheet((state) => state.open);
  const setOpen = useSheet((state) => state.setOpen);
  const links = [
    {
      title: "Dashboard",
      href: "/dashboard",
      type: "normal",
      icon: <DashboardIcon className="h-5 w-5" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/appointments",
      type: "normal",
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      title: "Patients",
      href: "/dashboard/patients",
      type: "normal",
      icon: <PatientsIcon className="h-5 w-5" />,
    },
    {
      title: "Services",
      href: "/dashboard/services",
      type: "normal",
      icon: <ServicesIcon className="h-5 w-5" />,
    },
    {
      title: "Finance",
      type: "accordion",
      icon: <InvoicesIcon className="h-5 w-5" />,
      items: [
        {
          title: "Revenue",
          href: "/dashboard/revenue",
          type: "normal",
          icon: <MoneyInIcon className="h-5 w-5" />,
        },
        {
          title: "Dépenses",
          href: "/dashboard/depenses",
          type: "normal",
          icon: <MoneyOutIcon className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      type: "normal",
      icon: <ReportsIcon className="h-5 w-5" />,
    },
    {
      title: "Paramètres",
      href: "/dashboard/settings",
      type: "normal",
      icon: <SettingsIcon className="h-5 w-5" />,
    },
  ] as SideBarItemProps[];
  if (type === "sheet") {
    return (
      <>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="bordered"
              isIconOnly
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex h-full max-h-screen flex-col gap-4 py-4">
              <div className="flex flex-col gap-8">
                <div className="flex min-h-[60px] items-center border-b border-default px-4 md:px-6">
                  <Link
                    href="/dashboard"
                    className="mx-auto flex h-full w-full items-center gap-2"
                  >
                    <img src="/logo.png" alt="logo" className="mx-auto h-28" />
                  </Link>
                </div>

                <SidebarMenu title="Main">
                  {links.map((link) => (
                    <SideBarItem key={link.title} {...link} />
                  ))}
                </SidebarMenu>
              </div>
              <div className="mt-auto">
                <Card shadow="sm" className="w-full">
                  <CardHeader className="flex flex-col items-start space-y-2 p-4">
                    <h3 className="text-tiny text-default-600">Logged in as</h3>
                    <User
                      name={user.name}
                      avatarProps={{
                        src: user.image!,
                        isBordered: true,
                      }}
                      classNames={{
                        name: "text-secondary font-semibold",
                        base: "gap-3",
                      }}
                    />
                  </CardHeader>
                  <CardBody className="p-4 pb-0 pt-1">
                    <form action={logout}>
                      <LogoutButton />
                    </form>
                  </CardBody>
                </Card>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      <nav className="grid h-full items-start px-4 py-4">
        <div className="flex h-fit flex-col space-y-2">
          {links.map((link) => (
            <SideBarItem key={link.title} {...link} />
          ))}
        </div>
        <div className="mt-auto">
          <Card shadow="sm" className="w-full">
            <CardHeader className="flex flex-col items-start space-y-2 p-4">
              <h3 className="text-tiny text-default-600">Logged in as</h3>
              {/* <div className="text-large text-secondary">
                <span className="font-semibold">Lahcen Elguarir</span>
              </div> */}
              <User
                name={user.name}
                avatarProps={{
                  src: user.image!,
                  isBordered: true,
                }}
                classNames={{
                  name: "text-secondary font-semibold",
                  base: "gap-3",
                }}
              />
            </CardHeader>
            <CardBody className="p-4 pb-0 pt-1">
              <form action={logout}>
                <LogoutButton />
              </form>
            </CardBody>
          </Card>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
