"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

import { Button } from "@nextui-org/button";
import PatientForm from "./patient-form";
import { PlusIcon } from "lucide-react";

export function RegisterPatientModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-medium"
          endContent={<PlusIcon className="w-5 h-5" />}
          color="primary"
        >
          Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un patient</DialogTitle>
          <DialogDescription>
            Ajouter un nouveau patient au système en remplissant le formulaire
            ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <PatientForm mode="create" onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
