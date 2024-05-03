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
import ServiceForm from "./service-form";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateServiceModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-medium"
          endContent={<PlusIcon className="h-5 w-5" />}
          color="primary"
        >
          Ajouter une Service
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un Service</DialogTitle>
          <DialogDescription>
            Ajouter un nouveau service au système en remplissant le formulaire
            ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm
          mode="create"
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
