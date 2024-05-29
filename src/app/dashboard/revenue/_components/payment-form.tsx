"use client";
import { CalendarIcon, SaveIcon, SearchIcon } from "@/components/icons";
import { Fieldset } from "@/components/ui/fieldset";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { DateInput } from "@nextui-org/date-input";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { api, vanilla } from "@/trpc/react";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { Payment, PaymentSchema } from "@/lib/schemas/new-payment";
import {
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { cn } from "@/lib/utils";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Avatar } from "@nextui-org/avatar";
import React from "react";

type Props = {
  mode?: "create" | "edit";
  paymentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const PaymentForm = ({
  mode = "create",
  paymentId,
  onSuccess,
  onCancel,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<Payment>({
    resolver: zodResolver(PaymentSchema),
    // @ts-ignore
    defaultValues: async () => {
      if (mode === "create" || !paymentId) {
        return {
          paymentDate: new Date(),
          amount: undefined,
          numberOfSessions: undefined,
          isPaid: true,
          notes: undefined,
          label: undefined,
          patientId: undefined,
          paymentMethod: "cash",
        };
      }
      let payment = await vanilla.payment.get.query({ id: paymentId });
      return {
        amount: payment.amount ?? 0,
        label: payment.label ?? undefined,
        numberOfSessions: payment.numberOfSessions ?? 1,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod ?? undefined,
        isPaid: payment.isPaid,
        notes: payment.notes ?? undefined,
        patientId: payment.patientId ?? undefined,
      };
    },
  });
  const amount = watch("amount");
  const paymentDate = watch("paymentDate");
  const paymendMethod = watch("paymentMethod");
  const numberOfSessions = watch("numberOfSessions");
  const isPaid = watch("isPaid");
  const patientId = watch("patientId");
  const createPayment = api.payment.create.useMutation();
  const updatePayment = api.payment.update.useMutation();
  const { data: patients, isLoading: isLoadingPatients } =
    api.patient.getAll.useQuery();

  async function onSubmit(values: Payment) {
    if (mode === "create") {
      console.log("values", values);
      createPayment.mutate(values, {
        onSuccess: (data) => {
          if (onSuccess) onSuccess();
          toast.success("Paiement enregistré avec succès");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
    if (mode === "edit" && paymentId) {
      updatePayment.mutate(
        { id: paymentId, data: values },
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
  const isDisabled =
    createPayment.isPending ||
    isLoading ||
    updatePayment.isPending ||
    isLoadingPatients;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full gap-y-6 pb-3 pt-6"
    >
      <Fieldset type="fieldset" legend="Détails du paiement">
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
              label="Étiquette"
              placeholder=" "
              description="Nom du service ou de la prestation"
              autoFocus
              isInvalid={!!errors.label}
              errorMessage={errors.label?.message}
              validate={() => {
                let error = errors.label?.message;
                if (error) {
                  return error;
                }
              }}
              {...register("label")}
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
                validationBehavior="native"
                validate={(v) => {
                  if (v === undefined || v === null || v === "") {
                    return "Veuillez remplir ce champ.";
                  }
                }}
                isRequired
                label="Montant"
                pattern="[0-9]*"
                type="number"
                min={0}
                placeholder=" "
                value={amount?.toString()}
                onChange={(e) => {
                  setValue("amount", parseInt(e.target.value));
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
                label="Nombre de séances"
                type="number"
                min={0}
                step={1}
                pattern="[0-9]*"
                endContent={
                  <span className="text-small text-default-500">
                    {numberOfSessions === 1 ? "séance" : "séances"}
                  </span>
                }
                description="Nombre de séances à payer"
                placeholder=" "
                value={numberOfSessions?.toString()}
                onChange={(e) => {
                  setValue("numberOfSessions", parseInt(e.target.value));
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <Autocomplete
              label="Patient"
              isDisabled={isDisabled}
              variant="bordered"
              defaultItems={patients ?? []}
              isLoading={isLoadingPatients}
              labelPlacement="outside"
              listboxProps={{
                color: "default",
                emptyContent: "Aucun patient trouvé",
                itemClasses: {
                  base: "rounded-small dark:data-[hover=true]:bg-default-100",
                },
              }}
              inputProps={{
                classNames: {
                  inputWrapper: cn(
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                  ),
                },
              }}
              description="Selectionnez un patient ou rechercher un patient par son nom"
              placeholder="Search for a patient"
              // @ts-ignore
              selectedKey={String(patientId)}
              onSelectionChange={(v) => {
                if (!v) {
                  setValue("patientId", undefined);
                } else {
                  setValue("patientId", parseInt(v.toString()));
                }
              }}
            >
              {(item) => (
                <AutocompleteItem
                  key={item.id}
                  textValue={`${item.firstName} ${item.lastName}`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      alt={item.firstName + " " + item.lastName}
                      className="flex-shrink-0"
                      size="sm"
                      src={`https://api.dicebear.com/8.x/initials/svg?fontSize=40&seed=${encodeURIComponent(item.firstName + " " + item.lastName)}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">
                        {item.firstName} {item.lastName}
                      </span>
                      <span className="text-tiny text-default-400">
                        {item.email}
                      </span>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
          <div className="w-full">
            <DatePicker
              classNames={{
                calendarContent: "min-w-[256px] overflow-x-hidden",
                inputWrapper:
                  "!focus-within:border-primary !hover:focus-whitin:border-primary !transition-all !duration-200",
              }}
              calendarProps={{
                classNames: {
                  title: "capitalize",
                },
              }}
              timeInputProps={{
                variant: "faded",
              }}
              label="Date de paiement"
              disableAnimation
              variant="bordered"
              isDisabled={isDisabled}
              labelPlacement="outside"
              isRequired
              hideTimeZone
              defaultValue={now(getLocalTimeZone())}
              onChange={(date) => {
                if (!date) return;
                let newDate = date.toDate();
                setValue("paymentDate", newDate);
              }}
              value={parseAbsoluteToLocal(paymentDate.toISOString())}
            />
          </div>
          <div className="w-full">
            <Switch
              isDisabled={isDisabled}
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                  "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 transition-colors duration-250 border-default-200",
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn(
                  "w-6 h-6 border-2 shadow-lg",
                  "group-data-[hover=true]:border-primary",
                  //selected
                  "group-data-[selected=true]:ml-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ml-5",
                ),
              }}
              defaultSelected={isPaid}
              isSelected={isPaid}
              onValueChange={(isSelected) => {
                setValue("isPaid", isSelected);
              }}
            >
              <div className="flex flex-col">
                <p className="text-medium">Le paiement a-t-il été effectué ?</p>
                <p className="text-tiny text-default-400">
                  Si oui, cochez cette case pour marquer le paiement comme
                  effectué
                </p>
              </div>
            </Switch>
          </div>
          <div className="w-full">
            <Select
              label="Méthode de paiement"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Sélectionnez une option"
              value={paymendMethod}
              isDisabled={isDisabled}
              defaultSelectedKeys={
                paymendMethod ? new Set([paymendMethod]) : ["cash"]
              }
              selectionMode="single"
              onChange={(e) =>
                setValue(
                  "paymentMethod",
                  e.target.value === "" ? undefined : e.target.value,
                )
              }
              classNames={{
                trigger:
                  "data-[open=true]:border-primary data-[focus=true]:border-primary !transition-all !duration-200",
              }}
            >
              <SelectItem key="cash" value="cash">
                Espèces
              </SelectItem>
              <SelectItem key="transfer" value="transfer">
                Virement
              </SelectItem>
              <SelectItem key="check" value="check">
                Chèque
              </SelectItem>
              <SelectItem key="other" value="other">
                Other
              </SelectItem>
            </Select>
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
              label="Notes"
              placeholder=" "
              description="Informations supplémentaires sur le paiement, par example: le numéro de chèque, le numéro de transaction ou toute autre information pertinente"
              isInvalid={!!errors.notes}
              errorMessage={errors.notes?.message}
              validate={() => {
                let error = errors.notes?.message;
                if (error) {
                  return error;
                }
              }}
              {...register("notes")}
            />
          </div>
        </div>
      </Fieldset>

      <div
        className={cn(
          "flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-between",
          mode === "create" && "flex-row sm:justify-end",
        )}
      >
        {mode === "edit" && (
          <Button
            isDisabled={isDisabled}
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
          fullWidth={mode === "create"}
        >
          {isDisabled ? (
            <>
              {
                {
                  create: "Enregistrement...",
                  edit: "Enregistrement...",
                }[mode]
              }
            </>
          ) : (
            <>
              {
                {
                  create: "Enregistrer",
                  edit: "Enregistrer les modifications",
                }[mode]
              }
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
export default PaymentForm;
