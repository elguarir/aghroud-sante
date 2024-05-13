"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import PaymentForm from "./payment-form";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
export function AddNewPaymentModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        onPress={onOpen}
        className="font-medium"
        endContent={<PlusIcon className="h-5 w-5" />}
        color="primary"
      >
        Paiement
      </Button>
      <Modal
        shouldBlockScroll
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        classNames={{
          base: "this-is-base my-auto md:max-h-[85dvh]",
          wrapper: "this-is-wrapper overflow-hidden",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
              <div className="rounded-md">
                <ModalHeader className="flex flex-col gap-1">
                  Ajouter un paiement
                  <p className="text-sm font-[450] text-default-500">
                    Ajouter un nouveau paiement au système en remplissant le
                    formulaire
                  </p>
                </ModalHeader>
                <ModalBody>
                  <PaymentForm
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

  // return (
  //   <Dialog open={open} onOpenChange={setOpen}>
  //     <DialogTrigger asChild>
  //       <Button
  //         className="font-medium"
  //         endContent={<PlusIcon className="h-5 w-5" />}
  //         color="primary"
  //       >
  //         Paiement
  //       </Button>
  //     </DialogTrigger>
  //     <DialogContent className="pb-0 sm:max-w-[460px]">
  //       <DialogHeader>
  //         <DialogTitle>Ajouter un paiement</DialogTitle>
  //         <DialogDescription>
  //           Ajouter un nouveau paiement au système en remplissant le formulaire
  //         </DialogDescription>
  //       </DialogHeader>
  //       <PaymentForm
  //         mode="create"
  //         onSuccess={() => {
  //           setOpen(false);
  //           router.refresh();
  //         }}
  //       />
  //     </DialogContent>
  //   </Dialog>
  // );
}
