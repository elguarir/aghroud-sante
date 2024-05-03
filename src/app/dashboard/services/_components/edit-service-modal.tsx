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

import ServiceForm from "./service-form";
import { useRouter } from "next/navigation";

interface EditServiceModalProps {
  serviceId: string;
  children: React.ReactNode;
}
export function EditServiceModal(props: EditServiceModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="pb-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le service</DialogTitle>
          <DialogDescription>
            Modifier les informations du service en remplissant le formulaire
            ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm
          mode="edit"
          serviceId={props.serviceId}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
