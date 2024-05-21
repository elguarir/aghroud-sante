"use client";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { ChevronDown } from "lucide-react";
import React from "react";

interface FieldsetProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  type?: "fieldset" | "accordion";
  legend: React.ReactNode;
}

const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ className, children, type = "accordion", legend, ...props }, ref) => {
    if (type === "accordion") {
      return (
        <Accordion>
          <AccordionItem
            title={
              <>
                <div className="flex items-center gap-x-2">
                  <hr className="w-4 border-divider bg-[0.5px] max-sm:flex-1" />
                  <span>{legend}</span>
                  <hr className="flex-1 border-divider bg-[0.5px]" />
                </div>
              </>
            }
            classNames={{
              title: "text-sm font-[550] text-secondary",
              trigger:
                "rounded-lg data-[focus=true]:outline-none data-[focus-visible=true]:outline-transparent",
            }}
            indicator={({ isOpen }) => (
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "-rotate-90" : ""}`}
              />
            )}
            key={"content"}
          >
            <div className={cn("grid gap-y-6", className)}>{children}</div>
          </AccordionItem>
        </Accordion>
      );
    }

    return (
      <fieldset ref={ref} className={cn("space-y-3", className)} {...props}>
        <legend
          className={cn(
            "w-full px-[5px] text-sm font-[550] text-secondary",
            className,
          )}
        >
          <div className="flex items-center gap-x-2">
            <hr className="w-4 border-divider bg-[0.5px] max-sm:flex-1" />
            {legend}
            <hr className="flex-1 border-divider bg-[0.5px]" />
          </div>
        </legend>
        <div className={cn("grid w-full", className)}>{children}</div>
      </fieldset>
    );
  },
);
Fieldset.displayName = "Fieldset";

// interface FieldsetTitleProps extends React.HTMLAttributes<HTMLLegendElement> {}

// const FieldsetTitle = React.forwardRef<HTMLLegendElement, FieldsetTitleProps>(
//   ({ className, children, ...props }, ref) => (
//     <legend
//       ref={ref}
//       className={cn(
//         "w-full px-[5px] text-sm font-[550] text-secondary",
//         className,
//       )}
//       {...props}
//     >
//       <div className="flex items-center gap-x-2">
//         <hr className="w-4 border-content4 bg-[0.5px] max-sm:flex-1" />
//         {children}
//         <hr className="flex-1 border-content4 bg-[0.5px]" />
//       </div>
//     </legend>
//   ),
// );
// FieldsetTitle.displayName = "FieldsetTitle";

// interface FieldsetContentProps extends React.HTMLAttributes<HTMLDivElement> {}

// const FieldsetContent = React.forwardRef<HTMLDivElement, FieldsetContentProps>(
//   ({ className, ...props }, ref) => (
//     <div
//       ref={ref}
//       className={cn("grid w-full gap-y-6", className)}
//       {...props}
//     />
//   ),
// );
// FieldsetContent.displayName = "FieldsetContent";

export { Fieldset };
