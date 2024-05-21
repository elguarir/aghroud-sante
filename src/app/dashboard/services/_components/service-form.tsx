"use client";
import { SaveIcon } from "@/components/icons";
import { Fieldset } from "@/components/ui/fieldset";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { api, vanilla } from "@/trpc/react";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { Service, ServiceSchema } from "@/lib/schemas/new-service";

type Props = {
  mode?: "create" | "edit";
  serviceId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ServiceForm = ({
  mode = "create",
  serviceId,
  onSuccess,
  onCancel,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<Service>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: async () => {
      if (mode === "create" || !serviceId)
        return {
          name: "",
          description: undefined,
        };
      let service = await vanilla.service.get.query({ id: serviceId });
      return {
        name: service?.name ?? "",
        description: service?.description ?? undefined,
        price: service?.price ?? undefined,
        duration: service?.duration ?? undefined,
      };
    },
  });

  const createService = api.service.create.useMutation();
  const updateService = api.service.update.useMutation();

  async function onSubmit(values: Service) {
    if (mode === "create") {
      createService.mutate(values, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          toast.success("Service ajouté avec succès");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
    if (mode === "edit" && serviceId) {
      updateService.mutate(
        { id: serviceId, data: values },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
            toast.success("Modifications enregistrées avec succès");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    }
  }
  if (isLoading) {
    return (
      <div className="flex h-52 w-full flex-col items-center justify-center pb-3 pt-8">
        <Spinner size="md" color="current" />
      </div>
    );
  }

  const router = useRouter();
  let price = watch("price");
  let duration = watch("duration");
  const isDisabled =
    createService.isPending || isLoading || updateService.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full gap-y-6 pb-3 pt-8"
    >
      <Fieldset type="fieldset" legend="Informations du service">
        <div className="grid w-full gap-y-6 pt-3">
          <div className="w-full">
            <Input
              isDisabled={isDisabled}
              classNames={{
                inputWrapper:
                  "group-data-[focus=true]:border-primary !transition-all !duration-200",
              }}
              variant="bordered"
              labelPlacement="outside"
              label="Nom du service"
              placeholder=" "
              isRequired
              autoFocus
              validate={() => {
                let error = errors.name?.message;
                if (error) {
                  return error;
                }
              }}
              {...register("name")}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-3 gap-y-6 md:grid-cols-2">
            <div className="w-full">
              <Input
                isDisabled={isDisabled}
                classNames={{
                  inputWrapper:
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                variant="bordered"
                labelPlacement="outside"
                endContent={
                  <span className="text-small text-default-500">MAD</span>
                }
                label="Prix"
                pattern="[0-9]*"
                type="number"
                min={0}
                step={5}
                placeholder=" "
                value={price?.toString()}
                onChange={(e) => {
                  setValue("price", parseInt(e.target.value));
                }}
              />
            </div>
            <div className="w-full">
              <Input
                isDisabled={isDisabled}
                classNames={{
                  inputWrapper:
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                variant="bordered"
                labelPlacement="outside"
                label="Durée"
                type="number"
                min={0}
                step={5}
                pattern="[0-9]*"
                endContent={
                  <span className="text-small text-default-500">min</span>
                }
                description="Durée du service en minutes"
                placeholder=" "
                value={duration?.toString()}
                onChange={(e) => {
                  setValue("duration", parseInt(e.target.value));
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <Textarea
              isDisabled={isDisabled}
              classNames={{
                inputWrapper:
                  "group-data-[focus=true]:border-primary !transition-all !duration-200",
              }}
              variant="bordered"
              labelPlacement="outside"
              label="Description"
              placeholder=" "
              {...register("description")}
            />
          </div>
        </div>
      </Fieldset>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        {mode === "edit" && (
          <Button
            variant="light"
            onClick={() => {
              if (onCancel) onCancel();
            }}
          >
            Annuler
          </Button>
        )}
        <Button
          endContent={<SaveIcon className="h-5 w-5" />}
          color="primary"
          type="submit"
          isLoading={isDisabled}
        >
          {isDisabled
            ? mode === "create"
              ? "Ajout en cours..."
              : "Enregistrement en cours..."
            : mode === "create"
              ? "Ajouter le service"
              : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
