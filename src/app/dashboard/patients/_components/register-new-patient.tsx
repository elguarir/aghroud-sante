"use client";
import { useState } from "react";

import { Button } from "@nextui-org/button";
import PatientForm from "./patient-form";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
export function RegisterPatientModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

  return (
    <>
      <Button
        className="font-medium"
        endContent={<PlusIcon className="h-5 w-5" />}
        color="primary"
        onPress={onOpen}
      >
        Patient
      </Button>
      <Modal
        shouldBlockScroll
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        classNames={{
          base: "md:max-h-[85dvh]",
          wrapper: "overflow-hidden",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div className="custom-scrollbar max-h-[90dvh] overflow-y-auto p-1">
              <div className="rounded-md">
                <ModalHeader className="flex flex-col gap-1">
                  Enregistrer un patient
                  <p className="text-sm font-[450] text-default-500">
                    Ajouter un nouveau patient au système en remplissant le
                    formulaire ci-dessous.
                  </p>
                </ModalHeader>
                <ModalBody>
                  <PatientForm
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
