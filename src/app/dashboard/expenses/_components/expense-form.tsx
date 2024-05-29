"use client";
import { CalendarIcon, SaveIcon, SearchIcon } from "@/components/icons";
import { Fieldset } from "@/components/ui/fieldset";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
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
import {
  Expense,
  ExpenseSchema,
  ExpenseTypes,
} from "@/lib/schemas/new-expense";

type Props = {
  mode?: "create" | "edit";
  expenseId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ExpenseForm = ({
  mode = "create",
  expenseId,
  onSuccess,
  onCancel,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<Expense>({
    resolver: zodResolver(ExpenseSchema),
    // @ts-ignore
    defaultValues: async () => {
      if (mode === "create" || !expenseId) {
        return {
          label: undefined,
          amount: undefined,
          expenseDate: new Date(),
          type: "OPERATIONAL",
          notes: undefined,
        };
      }
      let expense = await vanilla.expense.get.query({ id: expenseId });
      return {
        label: expense?.label,
        amount: expense?.amount,
        expenseDate: expense?.expenseDate,
        type: expense?.type,
        notes: expense?.notes,
      };
    },
  });
  const amount = watch("amount");
  const expenseDate = watch("expenseDate");
  const typeDepense = watch("type");

  const createExpense = api.expense.create.useMutation();
  const updateExpense = api.expense.update.useMutation();

  async function onSubmit(values: Expense) {
    if (mode === "create") {
      createExpense.mutate(values, {
        onSuccess: (data) => {
          if (onSuccess) onSuccess();
          toast.success("Dépense enregistrée avec succès");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
    if (mode === "edit" && expenseId) {
      updateExpense.mutate(
        { id: expenseId, data: values },
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
    createExpense.isPending || isLoading || updateExpense.isPending;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full gap-y-6 pb-3 pt-4"
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
              <Select
                label="Type de dépense"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Sélectionnez une option"
                value={typeDepense}
                isDisabled={isDisabled}
                defaultSelectedKeys={typeDepense ? new Set([typeDepense]) : []}
                selectionMode="single"
                onChange={(e) => {
                  if (!e.target.value) return;
                  setValue("type", e.target.value as Expense["type"]);
                }}
                classNames={{
                  trigger:
                    "data-[open=true]:border-primary data-[focus=true]:border-primary !transition-all !duration-200",
                }}
              >
                {ExpenseTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="w-full">
            <DatePicker
              classNames={{
                calendarContent: "min-w-[256px] overflow-x-hidden",
                inputWrapper:
                  "!focus-whitin:border-primary !hover:focus-whitin:border-primary !transition-all !duration-200",
              }}
              timeInputProps={{
                variant: "faded"
              }}
              disableAnimation
              calendarProps={{
                classNames: {
                  title: "capitalize",
                },
              }}
              label="Date de paiement"
              variant="bordered"
              isDisabled={isDisabled}
              labelPlacement="outside"
              isRequired
              hideTimeZone
              defaultValue={now(getLocalTimeZone())}
              onChange={(date) => {
                if (!date) return;
                let newDate = date.toDate();
                setValue("expenseDate", newDate);
              }}
              value={parseAbsoluteToLocal(expenseDate.toISOString())}
            />
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
              description="Informations supplémentaires sur cette dépense, par example le motif ou la raison de la dépense, etc."
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
export default ExpenseForm;
