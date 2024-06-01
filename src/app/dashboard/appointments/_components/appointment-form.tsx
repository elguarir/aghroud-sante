"use client";
import { EditIcon, PlusCircledIconFilled, SaveIcon } from "@/components/icons";
import { Fieldset } from "@/components/ui/fieldset";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
// import { TimeInput } from "@nextui-org/date-input";
import { Input, Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { api, vanilla } from "@/trpc/react";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import {
  Time,
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { Select, SelectItem, SelectedItems } from "@nextui-org/select";
import { cn } from "@/lib/utils";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Avatar } from "@nextui-org/avatar";
import React, { PropsWithChildren, useState } from "react";
import { Appointment, AppointmentSchema } from "@/lib/schemas/new-appointment";
import { Calendar } from "@nextui-org/calendar";
import { TimeInput, Tooltip } from "@nextui-org/react";
import {
  InfoCircledIcon,
  ReloadIcon,
  ThickArrowRightIcon,
} from "@radix-ui/react-icons";
import { Therapist } from "@prisma/client";
import TherapistForm from "./therapist-form";
import { Modal } from "@/components/reusable-modal";
import { toast } from "sonner";
import { RouterOutput } from "@/server/api/root";
import { Alert } from "@/components/ui/alert";
import { AppointmentStatus } from "./appointments-data";

type Props = {
  mode?: "create" | "edit";
  appointmentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const AppointmentForm = ({
  mode = "create",
  appointmentId,
  onSuccess,
  onCancel,
}: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<Appointment>({
    resolver: zodResolver(AppointmentSchema),
    // @ts-ignore
    defaultValues: async () => {
      if (mode === "create" || !appointmentId) {
        return {
          status: "CONFIRMED",
          startTime: now(getLocalTimeZone())
            .set({
              hour: 8,
              minute: 0,
            })
            .toDate(),
          endTime: now(getLocalTimeZone())
            .set({
              hour: 9,
              minute: 0,
            })
            .toDate(),
          patientId: undefined,
          floor: 1,
          notes: undefined,
          therapistId: undefined,
          serviceId: undefined,
        };
      }

      let appointment = await vanilla.appointment.get.query({
        id: appointmentId,
      });

      if (!appointment) return;
      return {
        startTime: new Date(appointment.startTime),
        endTime: new Date(appointment.endTime),
        serviceId: appointment.serviceId ?? undefined,
        therapistId: appointment.therapistId ?? undefined,
        floor: appointment.floor ?? undefined,
        patientId: appointment.patientId,
        status: appointment.status,
        notes: appointment.notes ?? undefined,
      };
    },
  });

  const [availabilityResult, setAvailabilityResult] = useState<
    RouterOutput["appointment"]["checkTimeAvailability"] | null
  >(null);

  const {
    patientId,
    startTime,
    endTime,
    status,
    floor,
    serviceId,
    therapistId,
  } = watch();

  // trpc mutations / utils
  const createAppointment = api.appointment.create.useMutation();
  const updateAppointment = api.appointment.update.useMutation();
  const { data: patients, isLoading: isLoadingPatients } =
    api.patient.getAll.useQuery();
  const { data: services, isLoading: isLoadingServices } =
    api.service.getAll.useQuery();
  const { data: therapists, isLoading: isLoadingTherapists } =
    api.therapist.getAll.useQuery();
  const checkAvailability = api.appointment.checkTimeAvailability.useMutation();
  const utils = api.useUtils();

  async function onSubmit(values: Appointment) {
    if (mode === "create") {
      console.log("values", values);
      createAppointment.mutate(values, {
        onSuccess: (data) => {
          if (onSuccess) onSuccess();
          toast.success("Rendez-vous créé avec succès");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
    if (mode === "edit" && appointmentId) {
      updateAppointment.mutate(
        { id: appointmentId, data: values },
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
  async function handleCheckAvailability() {
    if (!floor || !startTime || !endTime) {
      toast.info(
        "Vous devez remplir les champs requis: étage, date de début et date de fin",
      );
    }
    let result = await checkAvailability.mutateAsync({
      floor,
      startTime,
      endTime,
    });
    setAvailabilityResult(result);
  }

  if (isLoading) {
    return (
      <div className="flex h-52 w-full flex-col items-center justify-center pb-3 pt-8">
        <Spinner size="md" color="current" />
      </div>
    );
  }

  const isDisabled =
    createAppointment.isPending ||
    isLoading ||
    updateAppointment.isPending ||
    isLoadingPatients;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full gap-y-6 pb-3 pt-2"
    >
      <Fieldset type="fieldset" legend="Informations sur le rendez-vous">
        <div className="grid w-full gap-y-6 pt-4">
          <div className="flex w-full justify-center gap-4">
            {/* Calendar */}
            <Calendar
              disableAnimation
              classNames={{
                title: "capitalize",
                headerWrapper: "bg-default-50",
                gridHeader: "bg-default-50",
              }}
              onChange={(date) => {
                let parsedDate = date.toDate();
                setValue(
                  "startTime",
                  new Date(
                    parsedDate.setHours(
                      startTime.getHours(),
                      startTime.getMinutes(),
                    ),
                  ),
                );
                setValue(
                  "endTime",
                  new Date(
                    parsedDate.setHours(
                      endTime.getHours(),
                      endTime.getMinutes(),
                    ),
                  ),
                );
              }}
              value={parseAbsoluteToLocal(startTime.toISOString())}
            />
          </div>
          <div className="flex w-full items-end gap-2.5">
            {/* Start Time */}
            <div className="w-full">
              <TimeInput
                classNames={{
                  label: "text-foreground",
                }}
                color="primary"
                labelPlacement="outside"
                variant="bordered"
                hourCycle={24}
                value={new Time(startTime.getHours(), startTime.getMinutes())}
                onChange={(v) => {
                  if (!v) return;
                  let updatedStartTime = startTime.setHours(v.hour, v.minute);
                  setValue("startTime", new Date(updatedStartTime));
                }}
                label="Temps de début"
              />
            </div>
            <div className="mb-2.5 w-fit">
              <ThickArrowRightIcon className="h-5 w-5 text-default-500" />
            </div>
            {/* End Time */}
            <div className="w-full">
              <TimeInput
                classNames={{
                  label: "text-foreground",
                }}
                color="primary"
                value={new Time(endTime.getHours(), endTime.getMinutes())}
                onChange={(v) => {
                  if (!v) return;
                  let updatedEndTime = endTime.setHours(v.hour, v.minute);
                  setValue("endTime", new Date(updatedEndTime));
                }}
                endContent={
                  endTime.getTime() <= startTime.getTime() ? (
                    <Tooltip
                      content={
                        <>
                          La date de fin doit être supérieure <br /> à la date
                          de début
                        </>
                      }
                      placement="top"
                      showArrow
                      size="sm"
                      color="danger"
                    >
                      <button
                        type="button"
                        className="focus-visible:outline-none"
                      >
                        <InfoCircledIcon className="h-4 w-4 text-current" />
                      </button>
                    </Tooltip>
                  ) : undefined
                }
                isInvalid={endTime.getTime() <= startTime.getTime()}
                labelPlacement="outside"
                variant="bordered"
                hourCycle={24}
                label="Temps de fin"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-3 gap-y-6 md:grid-cols-2">
            {/* Status */}
            <div className="w-full">
              <Select
                label="Statut"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Sélectionnez une option"
                value={status}
                isDisabled={isDisabled}
                isRequired
                disallowEmptySelection
                items={AppointmentStatus}
                defaultSelectedKeys={status ? new Set([status]) : ["CONFIRMED"]}
                selectionMode="single"
                onChange={(e) => {
                  if (e.target.value === "") return;
                  setValue("status", e.target.value as Appointment["status"]);
                }}
                classNames={{
                  trigger:
                    "data-[open=true]:border-primary data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                renderValue={(
                  items: SelectedItems<(typeof AppointmentStatus)[number]>,
                ) => {
                  return items.map((item) => {
                    let className = `bg-${item.data?.color}`;
                    return (
                      <div key={item.key} className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${className}`}
                        />
                        <div>{item.data?.label}</div>
                      </div>
                    );
                  });
                }}
              >
                {(item) => {
                  let className = `bg-${item.color}`;
                  return (
                    <SelectItem
                      variant="faded"
                      key={item.value}
                      textValue={item.label}
                      color={item.color}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${className}`}
                        />
                        <div>{item.label}</div>
                      </div>
                    </SelectItem>
                  );
                }}
              </Select>
            </div>
            {/* Floor */}
            <div className="w-full">
              <Input
                isDisabled={isDisabled}
                classNames={{
                  inputWrapper:
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                variant="bordered"
                labelPlacement="outside"
                label="Étage"
                pattern="[0-9]*"
                type="number"
                min={0}
                placeholder=" "
                validate={() => {
                  if (!floor) return "Veuillez remplir ce champ";
                }}
                value={floor?.toString()}
                onChange={(e) => {
                  if (!e.target.value) return;
                  setValue("floor", parseInt(e.target.value));
                }}
              />
            </div>
            {/* Availability */}
            {/* {availabilityResult === null ? (
              <div className="col-span-full flex items-center justify-end">
                <Button
                  isLoading={checkAvailability.isPending}
                  color="secondary"
                  variant="faded"
                  onClick={handleCheckAvailability}
                >
                  {checkAvailability.isPending
                    ? "Vérification..."
                    : "Vérifier la disponibilité"}
                </Button>
              </div>
            ) : ( */}
            <Alert
              variant={
                availabilityResult === null
                  ? "default"
                  : availabilityResult.isAvailable
                    ? "success"
                    : "danger"
              }
              className="col-span-full"
              endContent={
                <Tooltip
                  delay={150}
                  closeDelay={100}
                  content="Re-vérifier la disponibilité"
                  size="sm"
                >
                  <button
                    onClick={handleCheckAvailability}
                    disabled={checkAvailability.isPending}
                    className="flex items-center transition-opacity hover:opacity-60 focus-visible:outline-none"
                    type="button"
                  >
                    {checkAvailability.isPending ? (
                      <Spinner size="sm" color="current" />
                    ) : (
                      <ReloadIcon className="size-4" />
                    )}
                  </button>
                </Tooltip>
              }
            >
              {availabilityResult === null ? (
                <>
                  <p className="leading-tight">
                    Vérifiez la disponibilité de la date et de l'étage
                  </p>
                </>
              ) : availabilityResult.isAvailable ? (
                <p className="leading-tight">La date est disponible.</p>
              ) : (
                <p className="leading-tight">La date n'est pas disponible.</p>
              )}
            </Alert>
            {/* )} */}
          </div>
          {/* Patients */}
          <div className="w-full">
            <Autocomplete
              label="Patient"
              isDisabled={isDisabled}
              variant="bordered"
              isRequired
              isInvalid={!!errors.patientId}
              errorMessage={errors.patientId?.message}
              // validate={(err) => {
              //   console.log(err)
              //   if (!patientId) return "Veuillez remplir ce champ";
              // }}
              defaultItems={patients ?? []}
              isLoading={isLoadingPatients}
              labelPlacement="outside"
              listboxProps={{
                color: "default",
                emptyContent: "Aucun patient trouvé",
                itemClasses: {
                  base: "rounded-small dark:data-[hover=true]:bg-default-100",
                },
                selectionMode: "multiple",
              }}
              inputProps={{
                classNames: {
                  inputWrapper: cn(
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                  ),
                },
              }}
              description="Selectionnez un patient ou rechercher un patient par son nom"
              placeholder="Chercher un patient"
              // @ts-ignore
              selectedKey={String(patientId)}
              onSelectionChange={(v) => {
                if (!v) return;
                setValue("patientId", parseInt(v.toString()));
              }}
            >
              {(item) => (
                <AutocompleteItem
                  key={item.id}
                  variant="faded"
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
          {/* Therapists */}
          <div className="flex w-full items-end gap-2">
            <div className="w-full">
              <Select
                items={therapists ?? []}
                isLoading={isLoadingTherapists}
                label="Médecin"
                placeholder="Sélectionnez un médecin"
                labelPlacement="outside"
                variant="bordered"
                value={therapistId}
                defaultSelectedKeys={therapistId ? [therapistId] : []}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setValue("therapistId", undefined);
                  } else {
                    setValue("therapistId", e.target.value);
                  }
                }}
                classNames={{
                  trigger:
                    "h-12 data-[open=true]:border-primary data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                renderValue={(items: SelectedItems<Therapist>) => {
                  return items.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <Avatar
                        alt={item.data?.name}
                        className="flex-shrink-0 border"
                        size="sm"
                        src={item.data?.image}
                      />
                      <div className="flex flex-col">
                        <span>{item.data?.name}</span>
                        <span className="text-tiny text-default-500">
                          ({item.data?.speciality})
                        </span>
                      </div>
                    </div>
                  ));
                }}
              >
                {(therapist) => (
                  <SelectItem
                    variant="faded"
                    key={therapist.id}
                    textValue={therapist.name}
                    value={therapist.id}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        alt={therapist.name}
                        className="flex-shrink-0"
                        size="sm"
                        src={therapist.image}
                      />
                      <div className="flex flex-col">
                        <span className="text-small">{therapist.name}</span>
                        <span className="text-tiny text-default-400">
                          {therapist.speciality}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </div>
            <div>
              <Modal
                title="Ajouter un nouveau médecin"
                trigger={
                  <Tooltip
                    content="Ajouter un nouveau médecin"
                    placement="top"
                    showArrow
                    delay={150}
                    closeDelay={100}
                    size="sm"
                  >
                    <Button isIconOnly variant="flat" className="!size-12">
                      <PlusCircledIconFilled className="h-6 w-6 text-default-500" />
                    </Button>
                  </Tooltip>
                }
                description="Ajouter un nouveau médecin à la liste des médecins"
              >
                {(close) => (
                  <TherapistForm
                    mode="create"
                    onSuccess={(data) => {
                      utils.therapist.getAll.invalidate();
                      setValue("therapistId", data.id);
                      close();
                    }}
                  />
                )}
              </Modal>
            </div>
          </div>
          {/* Service */}
          <div className="w-full">
            <Autocomplete
              label="Service"
              variant="bordered"
              isDisabled={isDisabled}
              defaultItems={services ?? []}
              isLoading={isLoadingServices}
              labelPlacement="outside"
              listboxProps={{
                color: "default",
                emptyContent: "Aucun service trouvé",
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
              description="Selectionnez une service ou rechercher par son nom"
              placeholder="Chercer une service"
              // @ts-ignore
              selectedKey={String(serviceId)}
              onSelectionChange={(v) => {
                if (!v) {
                  setValue("serviceId", undefined);
                } else {
                  setValue("serviceId", v.toString());
                }
              }}
            >
              {(item) => (
                <AutocompleteItem
                  variant="faded"
                  key={item.id}
                  textValue={`${item.name} - ${item.price?.toLocaleString()} MAD / ${item.duration} min`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-small">{item.name}</span>
                      <span className="text-tiny text-default-500">
                        {item.price?.toLocaleString()} MAD / {item.duration} min
                      </span>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
          {/* Notes */}
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
              description="Informations supplémentaires sur le rendez-vous"
              isInvalid={!!errors.notes}
              errorMessage={errors.notes?.message}
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
export default AppointmentForm;

interface TimePickerProps {
  value?: Date;
  onChange?: (value: Date) => void;
  orientation?: "horizontal" | "vertical";
}

const TimePicker = (props: TimePickerProps) => {
  const {
    value = new Date(),
    onChange = () => {},
    orientation = "vertical",
  } = props;

  const TimeButton = (props: PropsWithChildren) => {
    return (
      <Button
        variant="light"
        size="sm"
        type="button"
        className="textdefa rounded-md border border-default-200/50 bg-default-100 px-2 py-1.5 font-medium text-default-700 transition-colors duration-250 hover:bg-default-200/60 data-[focus-visible=true]:!outline-none data-[focus-visible=true]:!ring-0"
      >
        {props.children}
      </Button>
    );
  };

  return (
    <div className={cn("flex h-fit flex-col space-y-1.5 p-0.5")}>
      <TimeButton>
        <span>08:00</span>
      </TimeButton>
      <TimeButton>
        <span>08:30</span>
      </TimeButton>
      <TimeButton>
        <span>09:00</span>
      </TimeButton>
      <TimeButton>
        <span>09:30</span>
      </TimeButton>
      <TimeButton>
        <span>10:00</span>
      </TimeButton>
      <TimeButton>
        <span>10:30</span>
      </TimeButton>
      <TimeButton>
        <span>11:00</span>
      </TimeButton>
      <TimeButton>
        <span>11:30</span>
      </TimeButton>
      <TimeButton>
        <span>12:00</span>
      </TimeButton>
      <TimeButton>
        <span>12:30</span>
      </TimeButton>
      <TimeButton>
        <span>14:00</span>
      </TimeButton>
      <TimeButton>
        <span>14:30</span>
      </TimeButton>
      <TimeButton>
        <span>15:00</span>
      </TimeButton>
      <TimeButton>
        <span>15:30</span>
      </TimeButton>
      <TimeButton>
        <span>16:00</span>
      </TimeButton>
      <TimeButton>
        <span>16:30</span>
      </TimeButton>
      <TimeButton>
        <span>17:00</span>
      </TimeButton>
      <TimeButton>
        <span>17:30</span>
      </TimeButton>
      <TimeButton>
        <span>18:00</span>
      </TimeButton>
    </div>
  );
};
