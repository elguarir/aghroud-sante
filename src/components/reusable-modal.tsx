"use client";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import {
  Modal as NextUIModal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";

interface ReusableModalProps {
  trigger: ReactElement;
  title: string;
  description?: string;
  children: (onClose: () => void) => React.ReactNode;
  classNames?: ModalProps["classNames"];
  size?: ModalProps["size"];
}

export function Modal({
  trigger,
  title,
  description,
  children,
  classNames,
  size = "md",
}: ReusableModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const attachOnClick = (node: ReactNode): ReactNode => {
    if (isValidElement(node)) {
      if (node.type === Button) {
        // @ts-ignore shutup typescript I know what I'm doing 😤
        return cloneElement(node, { onClick: onOpen });
      }
      if (node.props.children) {
        return cloneElement(node, {
          // @ts-ignore
          children: Children.map(node.props.children, attachOnClick),
        });
      }
    }
    return node;
  };

  // const triggerWithOnClick = cloneElement(trigger, { onClick: onOpen });
  const triggerWithOnClick = attachOnClick(trigger);

  return (
    <>
      {triggerWithOnClick}
      <NextUIModal
        shouldBlockScroll
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        size={size}
        classNames={{
          base: cn("md:max-h-[85dvh]", classNames?.base),
          wrapper: cn("overflow-hidden", classNames?.wrapper),
          ...classNames,
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
              <div className="rounded-md">
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                  {description && (
                    <p className="text-sm font-[450] text-default-500">
                      {description}
                    </p>
                  )}
                </ModalHeader>
                <ModalBody>{children(onClose)}</ModalBody>
              </div>
            </div>
          )}
        </ModalContent>
      </NextUIModal>
    </>
  );
}
