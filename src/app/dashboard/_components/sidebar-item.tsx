"use client";
import { useSheet } from "@/hooks/use-collapsed-store";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
type Props = {
  title: string;
  icon: React.ReactNode;
  href?: string;
};

export const SideBarItem = ({ icon, title, href = "" }: Props) => {
  const setOpen = useSheet((state) => state.setOpen);
  const pathname = usePathname();
  const isActive = href === pathname;
  const { isTablet, isMobile } = useMediaQuery();
  const handleClick = () => {
    if (isTablet || isMobile) {
      setOpen(false);
    }
  };

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        "flex h-full w-full items-center gap-2.5 rounded-md focus-visible:outline-primary focus-visible:outline-offset-0 focus-visible:border focus-visible:border-primary px-3.5 py-2 text-medium font-medium text-default-600 transition-colors duration-200 hover:bg-default-200/30",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary-500/90"
          : "hover:text-default-900",
      )}
      onClick={handleClick}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};
