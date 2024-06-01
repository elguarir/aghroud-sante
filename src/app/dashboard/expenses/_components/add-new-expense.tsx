"use client";

import { Button } from "@nextui-org/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import ExpenseForm from "./expense-form";
export function AddNewExpenseModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  return (
    <>
      <Button
        onPress={onOpen}
        className="font-medium"
        endContent={<PlusIcon className="h-5 w-5" />}
        color="primary"
      >
        Dépense
      </Button>
      <Modal
        shouldBlockScroll
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        size="lg"
        classNames={{
          base: "md:max-h-[85dvh]",
          wrapper: "overflow-hidden",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
              <div className="rounded-md">
                <ModalHeader className="flex flex-col gap-1">
                  Ajouter une dépense
                  <p className="text-sm font-[450] text-default-500">
                    Ajouter une nouvelle dépense au système en remplissant le
                    formulaire
                  </p>
                </ModalHeader>
                <ModalBody>
                  <ExpenseForm
                    mode="create"
                    onSuccess={() => {
                      onClose();
                      router.refresh();
                    }}
                  />
                </ModalBody>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
