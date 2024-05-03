"use client";
import { api } from "@/trpc/react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  id: number;
};

const DeletePatientAction = (props: Props) => {
  const router = useRouter();
  const deletePatient = api.patient.delete.useMutation();

  return (
    <div className="flex w-full items-center justify-end gap-4">
      <Button variant="light" onClick={() => router.back()}>
        Annuler
      </Button>
      <Button
        color="danger"
        isLoading={deletePatient.isPending}
        onClick={async () => {
          await deletePatient.mutateAsync(
            { id: props.id },
            {
              onSuccess: () => {
                toast.success("Patient deleted successfully", {
                  duration: 1500,
                });
                router.back();

              },
              onError: (error) => {
                toast.error(error.message, {
                  duration: 1500,
                });
              },
            },
          );
          await new Promise((resolve) => setTimeout(resolve, 1600));
          router.push("/dashboard/patients");
        }}
      >
        {deletePatient.isPending ? "Suppression en cours..." : "Supprimer"}
      </Button>
    </div>
  );
};

export default DeletePatientAction;
