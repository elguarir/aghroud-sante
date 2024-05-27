"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark"}
      className="toaster group "
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-default-50/90 dark:group-[.toaster]:bg-default-50/80 group-[.toaster]:text-foreground dark:group-[.toaster]:text-foreground group-[.toaster]:text-default-500 group-[.toaster]:border-content2-foreground/20 dark:group-[.toaster]:border-default-300/40 group-[.toaster]:shadow-lg rounded-medium",
          description: "group-[.toast]:text-default-500",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-red-500 group-[.toast]:text-default-500",
          // :where([data-sonner-toast]):hover :where([data-close-button]):hover
          closeButton:
            "text-default-foreground bg-default-50 border-default-300 hover:group-hover:bg-default-100 hover:group-hover:border-default-400 transition-colors duration-200",
        },
      }}
      duration={1500}
      {...props}
    />
  );
};

export { Toaster };
