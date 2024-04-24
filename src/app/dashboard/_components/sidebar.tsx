"use client";
import { usePathname } from "next/navigation";
import { SidebarMenu } from "./sidebar-menu";
import { SideBarItem } from "./sidebar-item";
import {
  CalendarIcon,
  DashboardIcon,
  InvoicesIcon,
  PatientsIcon,
  ReportsIcon,
  ServicesIcon,
  SettingsIcon,
} from "@/components/icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@nextui-org/button";
import { Menu, Package2 } from "lucide-react";
import { useSheet } from "@/hooks/use-collapsed-store";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import type { User as TUser } from "next-auth";
import { logout } from "@/server/auth/actions";

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
      icon: <DashboardIcon className="h-5 w-5" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/appointments",
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      title: "Patients",
      href: "/dashboard/patients",
      icon: <PatientsIcon className="h-5 w-5" />,
    },
    {
      title: "Services",
      href: "/dashboard/services",
      icon: <ServicesIcon className="h-5 w-5" />,
    },
    {
      title: "Payments",
      href: "/dashboard/payments",
      icon: <InvoicesIcon className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <ReportsIcon className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <SettingsIcon className="h-5 w-5" />,
    },
  ];
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
                      <Button
                        type="submit"
                        variant="flat"
                        fullWidth
                        className="mb-4"
                      >
                        Logout
                      </Button>
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
                <Button type="submit" variant="flat" fullWidth className="mb-4">
                  Logout
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
