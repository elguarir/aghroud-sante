"use client";
import { FileUploadIcon, SaveIcon } from "@/components/icons";
import { Fieldset } from "@/components/ui/fieldset";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { api, vanilla } from "@/trpc/react";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { Therapist, TherapistSchema } from "@/lib/schemas/new-therapist";
import { CircularProgress } from "@nextui-org/progress";
import DropZone from "@/components/DropZone";
import { cn } from "@/lib/utils";
import { Avatar } from "@nextui-org/avatar";
import { RouterOutput } from "@/server/api/root";

type Props = {
  mode?: "create" | "edit";
  therapistId?: string;
  onSuccess?: (data: RouterOutput["therapist"]["register"]) => void;
  onCancel?: () => void;
};

const TherapistForm = ({
  mode = "create",
  therapistId,
  onSuccess,
  onCancel,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<Therapist>({
    resolver: zodResolver(TherapistSchema),
    defaultValues: async () => {
      if (mode === "create" || !therapistId)
        return {
          name: "",
          image: "",
          speciality: undefined,
        };
      let therapist = await vanilla.therapist.get.query({ id: therapistId });
      return {
        name: therapist?.name ?? "",
        speciality: therapist?.speciality ?? undefined,
        image: therapist?.image ?? undefined,
      };
    },
  });

  const createTherapist = api.therapist.register.useMutation();
  const updateTherapist = api.therapist.update.useMutation();

  async function onSubmit(values: Therapist) {
    if (mode === "create") {
      createTherapist.mutate(values, {
        onSuccess: (data) => {
          if (onSuccess) onSuccess(data);
          toast.success("Médecin ajouté avec succès");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
    if (mode === "edit" && therapistId) {
      updateTherapist.mutate(
        { id: therapistId, data: values },
        {
          onSuccess: (data) => {
            if (onSuccess) onSuccess(data);
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
  const image = watch("image");
  const isDisabled =
    createTherapist.isPending || isLoading || updateTherapist.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full gap-y-6 pb-3"
    >
      <div className="grid w-full gap-y-6 pt-3">
        <div className="space-y-[10px]">
          <label htmlFor="profile-pic-input" className="text-small">
            Image <span className="text-foreground-500">(optionnel)</span>
          </label>
          <div>
            <DropZone
              onChange={(url) => {
                setValue("image", url);
              }}
              onError={(error) => {
                toast.error(error);
              }}
              accept={{
                "image/jpeg": [],
                "image/png": [],
              }}
              render={({
                isDragActive,
                isDragReject,
                file,
                clear,
                isUploading,
                getRootProps,
                getInputProps,
              }) => {
                return image ? (
                  <div className="flex items-center gap-6">
                    <Avatar
                      src={image}
                      classNames={{
                        base: "w-24 h-24 border-[1.6px] border-content4",
                      }}
                      radius="lg"
                    />
                    <Button
                      color="danger"
                      type="button"
                      variant="bordered"
                      onClick={() => {
                        clear();
                        setValue("image", "");
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "flex h-24 w-24 cursor-pointer items-center justify-center rounded-large border-[1.6px] border-default-300/70 bg-default-100 transition-colors duration-250 ease-in-out focus-within:border-primary focus-within:outline-none hover:bg-content3/80",
                      isDragActive && "border-primary",
                      isDragReject && "border-danger",
                      isUploading && "pointer-events-none",
                    )}
                  >
                    <input {...getInputProps({ id: "profile-pic-input" })} />
                    {!file && !isUploading && !image && (
                      <div className="text-content3-foreground">
                        <FileUploadIcon className="h-8 w-8" />
                      </div>
                    )}
                    {isUploading &&
                      file &&
                      file.state.status === "uploading" && (
                        <div>
                          <CircularProgress
                            aria-label="Loading..."
                            size="lg"
                            value={file.state.progress}
                            color="secondary"
                            showValueLabel={true}
                          />
                        </div>
                      )}
                  </div>
                );
              }}
            />
          </div>
          <div className="relative !mt-0 flex flex-col p-1">
            <div className="text-tiny text-foreground-400">
              <span>Formats acceptés :</span>
              <span className="font-medium text-foreground-500">
                .jpeg, .png
              </span>
            </div>
          </div>
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
              label="Nom du médecin"
              placeholder=" "
              isRequired
              autoFocus
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              {...register("name")}
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
              label="Spécialité"
              placeholder=" "
              isInvalid={!!errors.speciality}
              errorMessage={errors.speciality?.message}
              {...register("speciality")}
            />
          </div>
        </div>
      </div>

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
              ? "Ajouter le médecin"
              : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
};

export default TherapistForm;
