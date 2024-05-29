"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
const alertVariants = cva(
  "flex shadow-sm w-full items-center gap-1.5 rounded-medium [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-neutral-600/20 to-neutral-700/20 p-3 text-neutral-600 dark:text-neutral-200",
        success:
          "bg-gradient-to-r from-lime-600/20 to-lime-700/20 p-3 text-lime-600 dark:text-lime-200",
        info: "bg-gradient-to-r from-blue-600/25 to-blue-700/25 p-3 text-blue-600 dark:text-blue-200",
        warning:
          "bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 p-3 text-yellow-600 dark:text-yellow-200",
        danger:
          "bg-gradient-to-r from-red-600/20 to-red-700/20 p-3 text-red-600 dark:text-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  endContent?: React.ReactNode;
}

function Alert({
  className,
  variant,
  children,
  icon,
  endContent,
  ...props
}: AlertProps) {
  const iconComponent = icon || (icons[variant as keyof typeof icons] ?? null);
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      {iconComponent && <div className="flex-shrink-0">{iconComponent}</div>}
      <div>{children}</div>
      {endContent && <div className="flex-shrink-0 ml-auto flex items-center">{endContent}</div>}
    </div>
  );
}

export { Alert, alertVariants };

const icons = {
  default: <InfoCircledIcon />,
  info: <InfoCircledIcon />,
  success: <CheckCircledIcon />,
  warning: <ExclamationTriangleIcon />,
  danger: <ExclamationTriangleIcon />,
};
