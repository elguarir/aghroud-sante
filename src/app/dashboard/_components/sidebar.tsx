"use client";
import { SideBarItem } from "./sidebar-item";
import { links } from "@/lib/constants";
import { useSheet } from "@/hooks/use-sheet";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import type { User as TUser } from "next-auth";
import { logout } from "@/server/auth/actions";
import LogoutButton from "./logout-button";
import "rsuite/Drawer/styles/index.css";
import Drawer from "rsuite/Drawer";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Menu } from "lucide-react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { SidebarMenu } from "./sidebar-menu";
type Props = {
  type: "normal" | "sheet";
  user: TUser;
};

const SideBar = ({ type = "normal", user }: Props) => {
  const open = useSheet((state) => state.open);
  const setOpen = useSheet((state) => state.setOpen);

  if (type === "sheet") {
    return (
      <>
        <Button
          isIconOnly
          radius="sm"
          size="sm"
          disableRipple
          className="md:hidden"
          variant="faded"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-4 w-4 text-default-600" />
        </Button>

        <Drawer
          placement="left"
          className="w-full max-w-[400px] focus-visible:outline-none"
          dialogClassName="[&>_div]:bg-background [&>_div]:dark:bg-secondary-foreground"
          size={"calc(100% - 60px)"}
          closeButton={<></>}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Drawer.Body className="custom-scrollbar !px-8 !py-0">
            <div className="absolute right-4 top-4">
              <Button
                variant="faded"
                size="sm"
                isIconOnly
                className="text-default-600"
                onClick={() => setOpen(false)}
              >
                <Cross1Icon />
              </Button>
            </div>

            <div className="h-full py-6 pb-8">
              <div className="flex h-full max-h-screen flex-col gap-4 py-4">
                <div className="flex flex-col gap-8">
                  <div className="flex min-h-[60px] items-center border-b border-default px-4 md:px-6">
                    <Link
                      href="/dashboard"
                      className="mx-auto flex h-full w-full items-center gap-2"
                    >
                      <img
                        src="/logo.png"
                        alt="logo"
                        className="mx-auto h-28"
                      />
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
                      <h3 className="text-tiny text-default-600">
                        Connecté en tant que
                      </h3>
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
            </div>
          </Drawer.Body>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <nav className="grid h-full items-start gap-y-8 px-4 py-4 pb-7">
        <div className="flex h-fit flex-col space-y-2">
          {links.map((link) => (
            <SideBarItem key={link.title} {...link} />
          ))}
        </div>
        <div className="mt-auto">
          <Card shadow="sm" className="w-full">
            <CardHeader className="flex flex-col items-start space-y-2 p-4">
              <h3 className="text-tiny text-default-600">
                Connecté en tant que
              </h3>
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
