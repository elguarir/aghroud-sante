"use client";
import { api } from "@/trpc/react";
import { Button, ButtonProps } from "@nextui-org/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverProps,
} from "@nextui-org/popover";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export type DeleteServiceButtonProps = ButtonProps & {
  serviceId: string;
  popoverPlacement: PopoverProps["placement"];
  popoverClassnames?: PopoverProps["classNames"];
};

export const DeleteServiceButton = ({
  serviceId,
  popoverPlacement,
  popoverClassnames,
  ...props
}: DeleteServiceButtonProps) => {
  const [open, setOpen] = useState(false);
  const deleteService = api.service.delete.useMutation();
  const router = useRouter();
  return (
    <Popover
      isOpen={open}
      onOpenChange={setOpen}
      placement={popoverPlacement}
      classNames={popoverClassnames}
    >
      <PopoverTrigger>
        <Button {...props} as={"div"}>
          <>{props.children || "Supprimer"}</>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-4 p-4 px-3 pr-1">
        <div className="space-y-1 px-1">
          <div className="text-medium font-semibold leading-tight">
            Êtes-vous sûr de supprimer ce service ?
          </div>
          <div className="text-small text-default-500">
            Cette action est irréversible et supprimera définitivement le
            service.
          </div>
        </div>
        <div className="flex w-full justify-end gap-2 px-2">
          <Button
            isDisabled={deleteService.isPending}
            variant="flat"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button
            color="secondary"
            isLoading={deleteService.isPending}
            onClick={() => {
              deleteService.mutate(
                { id: serviceId },
                {
                  onSuccess: () => {
                    router.refresh();
                    toast.success("Service supprimé avec succès");
                  },
                  onError: (error) => {
                    toast.error(error.message);
                  },
                  onSettled: () => {
                    setOpen(false);
                  },
                },
              );
            }}
          >
            {deleteService.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
