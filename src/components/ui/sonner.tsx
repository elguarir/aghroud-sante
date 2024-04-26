"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-content1 dark:group-[.toaster]:bg-secondary-600 group-[.toaster]:text-content1-foreground dark:group-[.toaster]:text-secondary-100 group-[.toaster]:text-default-500 group-[.toaster]:border-content2-foreground/20 dark:group-[.toaster]:border-content2-foreground group-[.toaster]:shadow-lg rounded-medium",
          description: "group-[.toast]:text-default-500",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-secondary group-[.toast]:text-default-500",
        },
      }}
      duration={1500}
      {...props}
    />
  );
};

export { Toaster };
