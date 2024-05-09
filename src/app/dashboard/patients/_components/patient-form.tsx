"use client";
import {
  CalendarIcon,
  CloudUpload,
  FileUploadIcon,
  PhoneIcon,
  SaveIcon,
} from "@/components/icons";
import { Fieldset } from "@/components/ui/fieldset";
import { Patient, PatientSchema } from "@/lib/schemas/new-patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DateInput } from "@nextui-org/date-input";
import { Input, Textarea, useInput } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { api, vanilla } from "@/trpc/react";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { FileCardPreview } from "./file-card";
import { DocumentsUpload } from "./documents-upload";
import { Divider } from "@nextui-org/divider";

type Props = {
  mode?: "create" | "edit";
  patientId?: number;
  onSuccess?: () => void;
};

const PatientForm = ({ mode = "create", patientId, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<Patient>({
    resolver: zodResolver(PatientSchema),
    defaultValues: async () => {
      if (mode === "create" || !patientId)
        return {
          firstName: "",
          lastName: "",
          documents: [],
        };
      let patient = await vanilla.patient.get.query({ id: patientId });
      return {
        firstName: patient?.firstName ?? "",
        lastName: patient?.lastName ?? "",
        phoneNumber: patient?.phoneNumber ?? undefined,
        email: patient?.email ?? undefined,
        address: patient?.address ?? undefined,
        dateOfBirth:
          patient?.dateOfBirth?.toISOString().split("T")[0] ?? undefined,
        insuranceProvider: patient?.insuranceProvider ?? undefined,
        notes: patient?.notes ?? undefined,
        documents: patient?.documents ?? [],
      };
    },
  });
  const doucments = watch("documents");

  const registerPatient = api.patient.register.useMutation();
  const updatePatient = api.patient.update.useMutation();

  async function onSubmit(values: Patient) {
    if (mode === "create") {
      registerPatient.mutate(values, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          toast.success("Patient ajouté avec succès");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
    if (mode === "edit" && patientId) {
      updatePatient.mutate(
        { id: patientId, data: values },
        {
          onSuccess: () => {
            toast.success("Modifications enregistrées avec succès");
            router.push(`/dashboard/patients/`);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    }
  }

  const dateOfBirth = watch("dateOfBirth");
  if (isLoading) {
    return (
      <div className="flex h-52 w-full flex-col items-center justify-center pb-3 pt-8">
        <Spinner size="md" color="current" />
      </div>
    );
  }
  const router = useRouter();
  const isDisabled =
    registerPatient.isPending || isLoading || updatePatient.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full gap-y-6 pb-3 pt-8"
    >
      <Fieldset type="fieldset" legend="Informations personnelles">
        <div className="grid w-full gap-y-6">
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
                label={"Prénom"}
                placeholder=" "
                isRequired
                autoFocus
                validate={() => {
                  let error = errors.firstName?.message;
                  if (error) {
                    return error;
                  }
                }}
                {...register("firstName")}
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
                validate={() => {
                  let error = errors.lastName?.message;
                  if (error) {
                    return error;
                  }
                }}
                label="Nom"
                placeholder=" "
                isRequired
                {...register("lastName")}
              />
            </div>
          </div>
          <div className="w-full">
            <DateInput
              classNames={{
                inputWrapper:
                  "focus-within:border-primary hover:focus-within:border-primary !transition-all !duration-200",
              }}
              label="La date de naissance"
              variant="bordered"
              isDisabled={isDisabled}
              value={dateOfBirth ? parseDate(dateOfBirth) : null}
              onChange={(date) => {
                setValue("dateOfBirth", date?.toLocaleString());
              }}
              labelPlacement="outside"
              endContent={
                <div className="flex items-center gap-1">
                  {dateOfBirth && (
                    <button
                      onClick={() => {
                        setValue("dateOfBirth", undefined);
                      }}
                      type="button"
                    >
                      <X className="h-4 w-4 text-default-400" />
                    </button>
                  )}
                  <CalendarIcon className="pointer-events-none h-4 w-4 flex-shrink-0 text-default-400" />
                </div>
              }
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
              label={"Téléphone"}
              placeholder="+212  -- -- -- --"
              startContent={<PhoneIcon className="h-4 w-4 text-default-500" />}
              {...register("phoneNumber")}
            />
          </div>
        </div>
      </Fieldset>

      <div className="grid w-full">
        <Fieldset type="accordion" legend="Informations supplémentaires">
          <div className="grid gap-y-6">
            {/* Email */}
            <div className="w-full">
              <Input
                isDisabled={isDisabled}
                classNames={{
                  inputWrapper:
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                variant="bordered"
                labelPlacement="outside"
                label={"Email"}
                placeholder=" "
                {...register("email")}
              />
            </div>
            {/*  Assurance */}
            <div className="w-full">
              <Input
                isDisabled={isDisabled}
                classNames={{
                  inputWrapper:
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                variant="bordered"
                labelPlacement="outside"
                label={"Assurance"}
                {...register("insuranceProvider")}
                placeholder=" "
              />
            </div>
            {/* Adresse */}
            <div className="w-full">
              <Input
                isDisabled={isDisabled}
                classNames={{
                  inputWrapper:
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                variant="bordered"
                labelPlacement="outside"
                label={"Adresse"}
                {...register("address")}
                placeholder=" "
              />
            </div>
            {/* Notes*/}
            <div className="w-full">
              <Textarea
                classNames={{
                  inputWrapper:
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                  description: "text-default-500",
                }}
                variant="bordered"
                labelPlacement="outside"
                label={"Notes"}
                placeholder=" "
                description="Ajoutez des notes supplémentaires sur le patient, par exemple des informations médicales ou des préférences spécifiques."
                {...register("notes")}
              />
            </div>
            {/* <div className="w-full">
            <DocumentsUpload patientId={patientId} />
          </div> */}
          </div>
        </Fieldset>

        <Fieldset type="accordion" legend="Documents Medical">
          <DocumentsUpload
            onChange={(newDocuments) => {
              setValue(
                "documents",
                doucments.concat(
                  newDocuments.filter(
                    (newDoc) =>
                      !doucments.some((doc) => doc.key === newDoc.key),
                  ),
                ),
              );
              console.log("newDocuments", newDocuments);
            }}
          />
          <div className="w-full space-y-4">
            <p className="text-small font-medium text-default-500">
              - Documents ajoutés
            </p>
            <div className="grid gap-2">
              {doucments.length === 0 && (
                <div className="flex items-center">
                  <span className="text-small italic text-default-500">
                    Aucun document ajouté...
                  </span>
                </div>
              )}
              {doucments.map((document) => (
                <FileCardPreview
                  key={document.key}
                  fileKey={document.key}
                  filename={document.name}
                  contentType={document.contentType}
                  fileSize={document.fileSize}
                  onDelete={() => {
                    setValue(
                      "documents",
                      doucments.filter((doc) => doc.key !== document.key),
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </Fieldset>
        <Divider className="mt-6" />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        {mode === "edit" && (
          <Button
            variant="light"
            onClick={() => router.replace("/dashboard/patients")}
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
              : "Enregistrement des modifications..."
            : mode === "create"
              ? "Ajouter le patient"
              : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
};
export default PatientForm;
