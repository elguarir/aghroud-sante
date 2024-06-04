"use client";

import { cn } from "@/lib/utils";
import { Time } from "@internationalized/date";
import { TimeInput, TimeInputValue } from "@nextui-org/date-input";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Select, SelectItem, SelectedItems } from "@nextui-org/select";
import {
  InfoCircledIcon,
  PlusIcon,
  ThickArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { FormEvent, FormEventHandler, useState } from "react";
import { AppointmentStatus } from "../appointments/_components/appointments-data";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { api } from "@/trpc/react";
import { Avatar } from "@nextui-org/avatar";
import { Appointment, Therapist } from "@prisma/client";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {};
const QuickActionsCard = (props: Props) => {
  let daysOfWeek = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });
  const [status, setStatus] = useState<Selection | string>("CONFIRMED");
  const [selectedDay, setSelectedDay] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  let [startTime, setStartTime] = useState<TimeInputValue>(new Time(8, 0));
  let [endTime, setEndTime] = useState<TimeInputValue>(new Time(9, 0));
  const [therapist, setTherapist] = useState<string | undefined>(undefined);
  const [patient, setPatient] = useState<number | undefined>(undefined);
  const [service, setService] = useState<string | undefined>(undefined);
  let isEndTimeValid = endTime && endTime > startTime;
  const { data: patients, isLoading: isLoadingPatients } =
    api.patient.getAll.useQuery();
  const { data: therapists, isLoading: isLoadingTherapists } =
    api.therapist.getAll.useQuery();
  const { data: services, isLoading: isLoadingServices } =
    api.service.getAll.useQuery();
  const createAppointment = api.appointment.create.useMutation();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // set the start time to the selected day
    let start = new Date(selectedDay);
    start.setHours(startTime.hour);
    start.setMinutes(startTime.minute);
    let end = new Date(selectedDay);
    end.setHours(endTime.hour);
    end.setMinutes(endTime.minute);
    if (!patient) {
      toast.error("Le patient est requis");
      return;
    }
    createAppointment.mutate(
      {
        startTime: start,
        endTime: end,
        status: status as any,
        patientId: patient,
        therapistId: therapist,
        serviceId: service,
      },
      {
        onSuccess: () => {
          toast.success("Rendez-vous créé avec succès");
          router.refresh();
        },
        onError: (err) => {
          toast.error(
            "Une erreur s'est produite lors de la création du rendez-vous",
          );
        },
      },
    );
  };

  return (
    <>
      <div className="flex h-full min-h-80 w-full">
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <h2 className="text-small text-default-foreground">Le jour</h2>
            <ScrollShadow
              className="flex w-[calc(100vw-77px)] items-center gap-2 py-1 pl-px pr-4 md:w-[calc(100vw-370px)] lg:w-[calc(100vw/2-241px)]"
              orientation="horizontal"
              hideScrollBar
            >
              {daysOfWeek.splice(0, 6).map((day) => (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "rounded-medium border border-default-foreground/5 bg-default-200/30 px-3 py-2 transition-colors duration-250 focus-visible:border-primary-300/65 focus-visible:outline-none focus-visible:ring-[0.5px] focus-visible:ring-primary-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-[1px] focus-visible:ring-offset-primary-300",
                    selectedDay &&
                      isSameDay(selectedDay, day) &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  <div className="flex items-center gap-1 text-nowrap">
                    <span className="text-sm capitalize">
                      {format(day, "EEEE", { locale: fr })}
                    </span>
                    <span className="text-sm">
                      {format(day, "dd", { locale: fr })}
                    </span>
                  </div>
                  <input
                    type="date"
                    className="hidden"
                    value={format(day, "yyyy-MM-dd")}
                  />
                </button>
              ))}
            </ScrollShadow>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex h-full w-full flex-1 flex-col justify-between gap-6"
          >
            <div className="flex flex-col space-y-6 @container">
              {/* start / end time */}
              <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4">
                <div className="col-span-full flex w-full items-end gap-2.5 @xl:col-span-8">
                  {/* Start Time */}
                  <div className="w-full">
                    <TimeInput
                      isDisabled={createAppointment.isPending}
                      classNames={{
                        label: "text-foreground",
                      }}
                      color="primary"
                      labelPlacement="outside"
                      variant="bordered"
                      hourCycle={24}
                      value={startTime}
                      isRequired
                      validationBehavior="native"
                      isInvalid={!startTime}
                      onChange={setStartTime}
                      endContent={
                        !startTime ? (
                          <Tooltip
                            content={<>Ce champ est requis</>}
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
                      label="Temps de début"
                    />
                  </div>
                  <div className="mb-2.5 w-fit">
                    <ThickArrowRightIcon className="h-5 w-5 text-default-500" />
                  </div>
                  {/* End Time */}
                  <div className="w-full">
                    <TimeInput
                      isDisabled={createAppointment.isPending}
                      classNames={{
                        label: "text-foreground",
                      }}
                      color="primary"
                      value={endTime}
                      onChange={setEndTime}
                      endContent={
                        !isEndTimeValid ? (
                          <Tooltip
                            content={
                              <>
                                {!isEndTimeValid && (
                                  <p className="max-w-44 text-balance">
                                    Ce champ est requis, et le temps de fin doit
                                    être supérieur au temps de début
                                  </p>
                                )}
                              </>
                            }
                            placement="top"
                            showArrow
                            size="sm"
                            color="danger"
                            closeDelay={100}
                            delay={150}
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
                      isInvalid={!isEndTimeValid}
                      isRequired
                      labelPlacement="outside"
                      variant="bordered"
                      hourCycle={24}
                      label="Temps de fin"
                    />
                  </div>
                </div>
                <div className="col-span-full mt-px w-full @xl:col-span-4">
                  <Select
                    isDisabled={createAppointment.isPending}
                    label="Statut"
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder="Sélectionnez une option"
                    value={status as any}
                    isRequired
                    disallowEmptySelection
                    items={AppointmentStatus}
                    defaultSelectedKeys={["CONFIRMED"]}
                    selectionMode="single"
                    onChange={(e) => {
                      if (e.target.value === "") return;
                      setStatus(e.target.value as any);
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
                          <div
                            key={item.key}
                            className="flex items-center gap-2"
                          >
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
              </div>
              {/* patient / therapist / service */}
              <div className="grid gap-x-4 gap-y-4 @container @xl:grid-cols-3">
                <div className="w-full">
                  <Autocomplete
                    label="Patient"
                    isDisabled={createAppointment.isPending}
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
                    placeholder="Chercher un patient"
                    // @ts-ignore
                    selectedKey={String(patient)}
                    isRequired
                    errorMessage="Ce champ est requis"
                    validationBehavior="native"
                    onSelectionChange={(v) => {
                      if (!v) return;
                      setPatient(parseInt(v.toString()));
                    }}
                    value={patient}
                  >
                    {(patient) => (
                      <AutocompleteItem
                        variant="faded"
                        key={patient.id}
                        textValue={patient.firstName + " " + patient.lastName}
                      >
                        <div className="flex w-fit flex-nowrap items-center gap-2">
                          <div className="flex flex-col">
                            <span className="text-nowrap text-small">
                              {patient.firstName} {patient.lastName}
                            </span>
                            <span className="text-tiny text-default-400">
                              {patient.phoneNumber}
                            </span>
                          </div>
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
                <div className="w-full">
                  <Select
                    isDisabled={createAppointment.isPending}
                    items={therapists ?? []}
                    isLoading={isLoadingTherapists}
                    placeholder="Sélectionnez un médecin"
                    labelPlacement="outside"
                    variant="bordered"
                    label="Médecin"
                    value={therapist}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setTherapist(undefined);
                      } else {
                        setTherapist(e.target.value);
                      }
                    }}
                    classNames={{
                      mainWrapper: "w-full",
                      trigger:
                        "data-[open=true]:border-primary data-[focus=true]:border-primary !transition-all !duration-200",
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
                        <div className="flex w-fit flex-nowrap items-center gap-2">
                          <Avatar
                            alt={therapist.name}
                            className="flex-shrink-0"
                            size="sm"
                            src={therapist.image}
                          />
                          <div className="flex flex-col">
                            <span className="text-nowrap text-small">
                              {therapist.name}
                            </span>
                            <span className="text-tiny text-default-400">
                              {therapist.speciality}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </div>
                <div className="w-full">
                  <Autocomplete
                    label="Service"
                    isDisabled={createAppointment.isPending}
                    variant="bordered"
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
                    placeholder="Chercher une service"
                    // @ts-ignore
                    selectedKey={String(service)}
                    onSelectionChange={(v) => {
                      if (!v) {
                        setService(undefined);
                      } else {
                        setService(v.toString());
                      }
                    }}
                  >
                    {(item) => (
                      <AutocompleteItem
                        variant="faded"
                        key={item.id}
                        textValue={item.name}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="text-small">{item.name}</span>
                            <span className="text-tiny text-default-500">
                              {item.price?.toLocaleString()} MAD /{" "}
                              {item.duration} min
                            </span>
                          </div>
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button
                startContent={<PlusIcon />}
                className="max-md:w-full"
                color="primary"
                type="submit"
                isLoading={createAppointment.isPending}
              >
                {createAppointment.isPending
                  ? "Création en cours..."
                  : "Créer un rendez-vous"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* patient actions */}
    </>
  );
};

export default QuickActionsCard;
