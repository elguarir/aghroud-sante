"use client";
import { ChevronDownIcon } from "@/components/icons";
import { useSheet } from "@/hooks/use-collapsed-store";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavbarItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
  type: "normal";
};

type NavbarAccordionItem = {
  title: string;
  icon: React.ReactNode;
  items: NavbarItem[];
  type: "accordion";
};

export type SideBarItemProps = NavbarItem | NavbarAccordionItem;

export const SideBarItem = (item: SideBarItemProps) => {
  const setOpen = useSheet((state) => state.setOpen);
  const pathname = usePathname();
  const isActive =
    item.type === "normal"
      ? pathname === item.href
      : item.items.map((i) => i.href).includes(pathname);
  const { isTablet, isMobile } = useMediaQuery();
  const handleClick = () => {
    if (isTablet || isMobile) {
      setOpen(false);
    }
  };

  if (item.type === "normal") {
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex h-full w-full items-center gap-2.5 rounded-md border border-transparent px-3.5 py-2 text-medium font-medium text-default-600 transition-[color] duration-200 hover:bg-default-200/30 focus-visible:border focus-visible:border-primary focus-visible:outline-offset-0 focus-visible:outline-primary",
          isActive
            ? "bg-primary text-primary-foreground hover:bg-primary-500/90"
            : "hover:text-default-900",
        )}
        onClick={handleClick}
      >
        {item.icon}
        <span>{item.title}</span>
      </Link>
    );
  }
  if (item.type === "accordion") {
    return (
      <>
        <Accordion
          className="px-0"
          itemClasses={{
            trigger:
              "py-2 rounded-md pl-3.5 data-[open=true]:bg-default-200/30 pr-3 border-transparent transition-colors duration-200 hover:bg-default-200/30",
            title: "text-medium font-medium text-default-600",
            heading: "transition-transform duration-200",
            indicator: "data-[open=true]:-rotate-180",
          }}
        >
          <AccordionItem
            startContent={item.icon}
            key={"content"}
            title={item.title}
            indicator={<ChevronDownIcon className="h-4 w-4" />}
          >
            <div className="ml-auto flex w-[98%] flex-col gap-2 border-l border-default-200 pl-1.5">
              {item.items.map((i) => {
                const isActive = pathname === i.href;
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={cn(
                      "flex h-full w-full items-center gap-2.5 rounded-md px-3.5 py-2 text-medium font-medium text-default-600 transition-colors duration-200 hover:bg-default-200/30 focus-visible:border focus-visible:border-primary focus-visible:outline-offset-0 focus-visible:outline-primary",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary-500/90"
                        : "hover:text-default-900",
                    )}
                    onClick={handleClick}
                  >
                    {i.icon}
                    <span>{i.title}</span>
                  </Link>
                );
              })}
            </div>
          </AccordionItem>
        </Accordion>
        {/* <button
          className={cn(
            "flex h-full w-full items-center justify-between gap-2 rounded-md px-3.5 py-2 text-medium font-medium text-default-600 transition-colors duration-200 hover:bg-default-200/30 focus-visible:border focus-visible:border-primary focus-visible:outline-offset-0 focus-visible:outline-primary",
            isActive
              ? "bg-primary text-primary-foreground hover:bg-primary-500/90"
              : "hover:text-default-900",
          )}
          onClick={handleClick}
        >
          <div className="flex items-center gap-2.5">
            {item.icon}
            <span>{item.title}</span>
          </div>
          <div>
            <ChevronDownIcon
              className={cn(
                "ml-auto h-4 w-4 transition-transform duration-200",
                isActive && "rotate-180 transform",
              )}
            />
          </div>
        </button> */}
      </>
    );
  }
};
