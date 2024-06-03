"use client";
import React, { useState } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  SortDescriptor,
  Selection,
} from "@nextui-org/table";
import { CircleFadingPlus, MoreVertical } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { columns, AppointmentsData } from "./appointments-data";
import { User } from "@nextui-org/user";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Pagination } from "@nextui-org/pagination";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { EditIcon, EyeFilledIcon, TrashIcon } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Chip } from "@nextui-org/chip";
import { ArrowRightIcon, ClockIcon } from "@radix-ui/react-icons";
import { format, isSameDay, isWithinInterval } from "date-fns";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { AppointmentStatus } from "./appointments-data";
import AppointmentForm from "./appointment-form";
import { capitalize } from "@/lib/utils";
import { Divider } from "@nextui-org/divider";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { DateRange, DateRangePicker } from "@/components/ui/date-picker";
import { presets, getLastMonthsRange } from "@/lib/constants";
import { fr } from "date-fns/locale";
import { Select, SelectItem, SelectedItems } from "@nextui-org/select";
import { Therapist } from "@prisma/client";
import { Avatar } from "@nextui-org/avatar";
import { RouterOutput } from "@/server/api/root";
const INITIAL_VISIBLE_COLUMNS = [
  "patient",
  "therapist",
  "startTime",
  "floor",
  "notes",
  "status",
  "actions",
];

interface AppointmentsTableProps {
  appointments: AppointmentsData[];
}
export default function AppointmentsTable({
  appointments,
}: AppointmentsTableProps) {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );

  // Handling modal actions
  const [appointmentToModify, setAppointmentToModify] = React.useState<
    string | null
  >(null);
  const [appointmentToDelete, setAppointmentToDelete] = React.useState<
    string | null
  >(null);
  const {
    isOpen: isModifyModalOpen,
    onOpen: onModifyOpen,
    onOpenChange: onModifyOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const deleteAppointment = api.appointment.delete.useMutation();
  const { data: therapists, isLoading: isLoadingTherapists } =
    api.therapist.getAll.useQuery();
  const { data: patients, isLoading: isLoadingPatients } =
    api.patient.getAll.useQuery();
  // Filters
  const [statusFilters, setStatusFilters] = React.useState<Selection>(
    new Set([]),
  );
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    ...getLastMonthsRange(1),
  });
  const [therapistFilter, setTherapistFilter] = useState<string | undefined>(
    undefined,
  );

  const [patientFilter, setPatientFilter] = useState<number | undefined>(
    undefined,
  );

  const hasSearchFilter = Boolean(filterValue);
  const hasDateFilter =
    dateFilter &&
    dateFilter?.from !== undefined &&
    dateFilter?.to !== undefined;
  const hasStatusFilter = Boolean(Array.from(statusFilters).length > 0);
  const hasTherapistFilter = Boolean(therapistFilter !== undefined);
  const hasPatientFilter = Boolean(patientFilter !== undefined);

  // Columns, Rows per page, Sort
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "startTime",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAppointments = [...appointments];

    if (hasSearchFilter) {
      filteredAppointments = filteredAppointments.filter((appointment) => {
        let patient = appointment.patient;
        return (
          patient?.firstName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          patient?.lastName.toLowerCase().includes(filterValue.toLowerCase()) ||
          `${patient?.firstName} ${patient?.lastName}`
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          patient?.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
          appointment?.service?.name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          appointment?.therapist?.name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          appointment?.status
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          appointment?.notes
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          format(appointment.startTime, "dd/MM/yyyy, HH:mm").includes(
            filterValue,
          )
        );
      });
    }

    if (hasStatusFilter) {
      filteredAppointments = filteredAppointments.filter((appointment) => {
        if (appointment.status) {
          return Array.from(statusFilters).includes(appointment.status);
        }
        return false;
      });
    }

    if (hasDateFilter) {
      if (isSameDay(dateFilter.from!, dateFilter.to!)) {
        filteredAppointments = filteredAppointments.filter((appointment) => {
          return isSameDay(appointment.startTime, dateFilter.from!);
        });
      } else {
        filteredAppointments = filteredAppointments.filter((appointment) => {
          return isWithinInterval(appointment.startTime, {
            start: dateFilter.from!,
            end: dateFilter.to!,
          });
        });
      }
    }

    if (hasTherapistFilter) {
      filteredAppointments = filteredAppointments.filter((appointment) => {
        return appointment.therapist?.id === therapistFilter;
      });
    }

    if (hasPatientFilter) {
      filteredAppointments = filteredAppointments.filter((appointment) => {
        return appointment.patient?.id === patientFilter;
      });
    }

    return filteredAppointments;
  }, [
    appointments,
    filterValue,
    statusFilters,
    dateFilter,
    therapistFilter,
    patientFilter,
  ]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: AppointmentsData, b: AppointmentsData) => {
      const first = a[
        sortDescriptor.column as keyof AppointmentsData
      ] as number;
      const second = b[
        sortDescriptor.column as keyof AppointmentsData
      ] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Renderers
  const renderCell = React.useCallback(
    (appointment: AppointmentsData, columnKey: React.Key) => {
      const cellValue = appointment[columnKey as keyof AppointmentsData];
      switch (columnKey) {
        case "patient":
          return (
            <>
              {appointment.patient ? (
                <User
                  classNames={{
                    base: "space-x-2",
                  }}
                  avatarProps={{
                    radius: "lg",
                    isBordered: true,
                    src: `https://api.dicebear.com/8.x/initials/svg?fontSize=40&seed=${encodeURIComponent(appointment.patient?.firstName + " " + appointment.patient?.lastName)}`,
                    getInitials(name) {
                      return name
                        .split(" ")
                        .map((n) => n[0])
                        .join("");
                    },
                  }}
                  description={appointment.patient?.email}
                  name={
                    <p className="text-nowrap">
                      {appointment.patient?.firstName +
                        " " +
                        appointment.patient?.lastName}
                    </p>
                  }
                >
                  {appointment.patient?.phoneNumber ?? null}
                </User>
              ) : (
                <div className="py-2">
                  <p className="text-bold text-center text-small capitalize">
                    Non défini
                  </p>
                </div>
              )}
            </>
          );
        case "therapist":
          return (
            <div className="flex h-full items-center">
              {appointment.therapist ? (
                <User
                  classNames={{
                    base: "space-x-2",
                  }}
                  avatarProps={{
                    radius: "lg",
                    isBordered: true,
                    src:
                      appointment.therapist.image ??
                      `https://api.dicebear.com/8.x/initials/svg?fontSize=40&seed=${encodeURIComponent(appointment.therapist?.name)}`,
                    getInitials(name) {
                      return name
                        .split(" ")
                        .map((n) => n[0])
                        .join("");
                    },
                  }}
                  description={
                    <p className="max-w-[120px] truncate">
                      {appointment.therapist?.speciality}
                    </p>
                  }
                  name={
                    <p className="text-nowrap">{appointment.therapist?.name}</p>
                  }
                />
              ) : (
                <div className="py-2">
                  <p className="text-bold text-center text-small capitalize">
                    Non défini
                  </p>
                </div>
              )}
            </div>
          );
        case "service":
          return (
            <>
              {appointment.service ? (
                <div className="flex w-fit flex-col flex-nowrap -space-y-0.5 rounded-lg border border-default-300/80 bg-default-100 px-2.5 py-1 shadow-sm">
                  <div>
                    <p className="text-small font-medium capitalize">
                      {appointment.service.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-nowrap text-tiny text-default-500">
                      {new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 0,
                      }).format(Number(appointment.service.price))}{" "}
                      MAD / {appointment.service.duration} min
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <p className="text-bold text-center text-small capitalize">
                    Non défini
                  </p>
                </div>
              )}
            </>
          );
        case "status": {
          const status = AppointmentStatus.find(
            (st) => st.value === appointment.status,
          );
          if (!status)
            return (
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">Non défini</p>
              </div>
            );
          return (
            <div className="flex flex-col">
              <Chip
                radius="sm"
                startContent={<div className="pl-1">{status.icon}</div>}
                variant="flat"
                color={status.color}
              >
                {status.label}
              </Chip>
            </div>
          );
        }
        case "notes":
          return (
            <div className="flex flex-col">
              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                  <Button
                    size="sm"
                    variant="light"
                    className="w-fit text-default-600"
                    startContent={
                      <EyeFilledIcon className="h-4 w-4 text-default-600" />
                    }
                  >
                    Afficher
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="max-w-md px-1 py-2">
                    <div className="text-small font-bold">Notes</div>
                    <div className="text-tiny">
                      {appointment?.notes || "Aucune notes disponibles"}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          );
        case "startTime": {
          // check if current time is between start and end time
          let isOnGoing = isWithinInterval(new Date(), {
            start: appointment.startTime,
            end: appointment.endTime,
          });
          return (
            <div className="flex flex-col">
              <div className="text-bold flex w-fit flex-nowrap items-center gap-1 text-nowrap text-small capitalize">
                <Chip
                  variant={"dot"}
                  classNames={{
                    dot: isOnGoing && "animate-pulse",
                  }}
                  color={isOnGoing ? "success" : "default"}
                  className="w-fit rounded-md text-default-600"
                >
                  {isSameDay(appointment.startTime, appointment.endTime) ? (
                    <div className="flex flex-nowrap items-center gap-px font-[450]">
                      {format(appointment.startTime, "dd/MM/yyyy, HH:mm")}
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                      {format(appointment.endTime, "HH:mm")}
                    </div>
                  ) : (
                    <div className="flex flex-nowrap items-center gap-px font-[450]">
                      {format(appointment.startTime, "dd/MM/yyyy, HH:mm")}
                      <ArrowRightIcon className="h-4 w-4" />
                      {format(appointment.endTime, "dd/MM/yyyy, HH:mm")}
                    </div>
                  )}
                </Chip>
              </div>
            </div>
          );
        }
        case "actions":
          return (
            <>
              <div className="relative flex items-center justify-end gap-2">
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <MoreVertical className="text-default-300" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      startContent={<EditIcon className="h-4 w-4" />}
                      onPress={() => {
                        setAppointmentToModify(appointment.id);
                        onModifyOpenChange();
                      }}
                    >
                      Modifier
                    </DropdownItem>

                    <DropdownItem
                      color="danger"
                      onPress={() => {
                        setAppointmentToDelete(appointment.id);
                        onDeleteOpenChange();
                      }}
                      startContent={<TrashIcon className="h-4 w-4" />}
                    >
                      Supprimer
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </>
          );
        default:
          return cellValue?.toString() || "-";
      }
    },
    [],
  );

  const RenderFilters = React.useCallback(
    ({ filter }: { filter: string }) => {
      switch (filter) {
        case "status": {
          const statusFiltersArray = Array.from(statusFilters);
          if (statusFiltersArray.length > 0) {
            return (
              <>
                <Divider orientation="vertical" className="h-[60%] w-[0.9px]" />
                <div className="flex items-center gap-1">
                  {statusFiltersArray.length <= 2 ? (
                    <>
                      {statusFiltersArray.map((method) => (
                        <Chip
                          key={method}
                          variant="faded"
                          radius="sm"
                          color="secondary"
                        >
                          {
                            AppointmentStatus.find((m) => m.value === method)
                              ?.label
                          }
                        </Chip>
                      ))}
                    </>
                  ) : (
                    <div>
                      <Chip variant="faded" radius="sm" color="secondary">
                        {statusFiltersArray.length} Séléctionnés
                      </Chip>
                    </div>
                  )}
                </div>
              </>
            );
          } else {
            return undefined;
          }
        }
        default:
          return <></>;
      }
    },
    [statusFilters],
  );

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex flex-wrap items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Tous les rendez-vous sélectionnés"
            : `${selectedKeys.size} sur ${filteredItems.length} sélectionnés`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const topContent = React.useMemo(() => {
    return (
      <>
        <div className="flex w-full flex-col gap-4">
          {/* search bar, filters */}
          <div className="custom-scrollbar flex h-fit w-full items-end justify-between gap-6 overflow-x-auto py-2">
            <div className="flex w-full items-center justify-between gap-6">
              <div className="flex w-full min-w-fit items-center gap-2">
                {/* search bar */}
                <Input
                  isClearable
                  variant="bordered"
                  className="w-full min-w-[300px] max-w-[350px]"
                  classNames={{
                    inputWrapper:
                      "group-data-[focus=true]:border-primary !transition-all !duration-200",
                  }}
                  placeholder="Rechercher un rendez-vous"
                  startContent={
                    <SearchIcon className="h-5 w-5 text-default-500" />
                  }
                  value={filterValue}
                  onClear={() => onClear()}
                  onValueChange={onSearchChange}
                />
                {/* filters */}
                <div className="flex min-w-fit items-center gap-2">
                  <Popover
                    triggerScaleOnOpen={false}
                    placement="bottom-start"
                    offset={10}
                  >
                    <PopoverTrigger>
                      <Button
                        startContent={
                          <CircleFadingPlus className="h-4 w-4 flex-shrink-0 text-default-500" />
                        }
                        endContent={<RenderFilters filter="status" />}
                        color="default"
                        variant="bordered"
                      >
                        Statut
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full min-w-[200px] rounded-small p-1 pb-1.5">
                      <div className="flex w-full flex-col gap-2">
                        <Listbox
                          variant="flat"
                          selectionMode="multiple"
                          selectedKeys={statusFilters}
                          onSelectionChange={(keys) => {
                            setPage(1);
                            setStatusFilters(keys);
                          }}
                        >
                          {AppointmentStatus.map((method) => {
                            let color = `bg-${method.color}`;
                            return (
                              <ListboxItem
                                key={method.value}
                                startContent={
                                  <div
                                    className={`size-1.5 rounded-full ${color}`}
                                  ></div>
                                }
                              >
                                {method.label}
                              </ListboxItem>
                            );
                          })}
                        </Listbox>
                        {hasStatusFilter && (
                          <>
                            <Divider className="mx-auto w-[90%]" />
                            <div className="flex w-full justify-end gap-2">
                              <Button
                                size="sm"
                                variant="light"
                                color="default"
                                radius="sm"
                                fullWidth
                                onPress={() => {
                                  setPage(1);
                                  setStatusFilters(new Set([]));
                                }}
                              >
                                Réinitialiser
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {/* Date Filter */}
                  <div className="w-fit">
                    <DateRangePicker
                      presets={presets}
                      value={dateFilter}
                      align="end"
                      onChange={(range) => {
                        setPage(1);
                        if (!range) {
                          setDateFilter(undefined);
                          return;
                        }
                        setDateFilter({
                          from: range?.from
                            ? new Date(range?.from?.setHours(15))
                            : range?.from,
                          to: range?.to
                            ? new Date(range?.to?.setHours(15))
                            : range?.to,
                        });
                      }}
                      className="w-64 min-w-fit rounded-large"
                      locale={fr}
                      translations={{
                        range: "Période",
                        apply: "Appliquer",
                        cancel: "Annuler",
                        start: "Début",
                        end: "Fin",
                      }}
                      placeholder="Choisir une période"
                    />
                  </div>
                  {/* Patients Filter */}
                  <div className="w-fit">
                    <Select
                      items={patients ?? []}
                      isLoading={isLoadingPatients}
                      placeholder="Sélectionnez un patient"
                      labelPlacement="outside"
                      variant="bordered"
                      value={patientFilter}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setPage(1);
                          setPatientFilter(undefined);
                        } else {
                          setPage(1);
                          setPatientFilter(parseInt(e.target.value));
                        }
                      }}
                      classNames={{
                        mainWrapper: "w-full",
                        trigger:
                          "data-[open=true]:border-primary w-fit min-w-[220px] data-[focus=true]:border-primary !transition-all !duration-200",
                      }}
                      renderValue={(
                        items: SelectedItems<
                          RouterOutput["patient"]["getAll"][number]
                        >,
                      ) => {
                        return items.map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center gap-2"
                          >
                            <div className="flex flex-col">
                              <span>
                                {item.data?.firstName} {item.data?.lastName}
                              </span>
                              <span className="text-tiny text-default-500">
                                ({item.data?.phoneNumber})
                              </span>
                            </div>
                          </div>
                        ));
                      }}
                    >
                      {(patient) => (
                        <SelectItem
                          variant="faded"
                          key={patient.id}
                          textValue={patient.firstName + " " + patient.lastName}
                          value={patient.id}
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
                        </SelectItem>
                      )}
                    </Select>
                  </div>

                  {/* Therapist Filter */}
                  <div className="w-fit">
                    <Select
                      items={therapists ?? []}
                      isLoading={isLoadingTherapists}
                      placeholder="Sélectionnez un médecin"
                      labelPlacement="outside"
                      variant="bordered"
                      value={therapistFilter}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setPage(1);
                          setTherapistFilter(undefined);
                        } else {
                          setPage(1);
                          setTherapistFilter(e.target.value);
                        }
                      }}
                      classNames={{
                        mainWrapper: "w-full",
                        trigger:
                          "data-[open=true]:border-primary w-fit min-w-[220px] data-[focus=true]:border-primary !transition-all !duration-200",
                      }}
                      renderValue={(items: SelectedItems<Therapist>) => {
                        return items.map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center gap-2"
                          >
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
                </div>
              </div>
              {/* columns */}
              <div className="flex gap-3">
                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button
                      endContent={<ChevronDownIcon className="h-4 w-4" />}
                      variant="flat"
                    >
                      Colonnes
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="primary"
                    disallowEmptySelection
                    aria-label="Table Columns"
                    closeOnSelect={false}
                    selectedKeys={visibleColumns}
                    selectionMode="multiple"
                    onSelectionChange={setVisibleColumns}
                  >
                    {columns.map((column) => (
                      <DropdownItem key={column.uid} className="capitalize">
                        {capitalize(column.name)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
          {/* lignes oer oage */}
          <div className="flex items-center justify-between">
            <span className="text-small text-default-400">
              Total: {appointments.length} Rendez-vous
            </span>
            <label className="flex items-center text-small text-default-400">
              Lignes par page :
              <select
                className="bg-transparent text-small text-default-400 outline-none"
                onChange={onRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          </div>
        </div>
      </>
    );
  }, [
    filterValue,
    statusFilters,
    visibleColumns,
    therapists,
    therapistFilter,
    dateFilter,
    onSearchChange,
    onRowsPerPageChange,
    appointments.length,
    hasSearchFilter,
  ]);

  // let RenderModals = () => {
  //   let modalsCopy = {
  //     update: {
  //       title: "Modifier le rendez-vous",
  //       description: "Modifiez les informations du rendez-vous ci-dessous.",
  //     },
  //     delete: {
  //       title: "Supprimer le rendez-vous",
  //       description: "Êtes-vous sûr de vouloir supprimer ce rendez-vous ?",
  //     },
  //   };

  //   if (!actionToPerform || !showActionModal) return null;
  //   if (actionToPerform.action === "delete") {
  //     return (
  //       <Modal
  //         isOpen={showActionModal}
  //         onClose={() => clearAction()}
  //         placement="center"
  //         backdrop="blur"
  //         size="lg"
  //         classNames={{
  //           base: "md:max-h-[85dvh]",
  //           wrapper: "overflow-hidden",
  //         }}
  //       >
  //         <ModalContent>
  //           <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
  //             <div className="rounded-md">
  //               <ModalHeader className="flex flex-col">
  //                 {modalsCopy.delete.title}
  //                 <p className="text-sm font-[450] text-default-500">
  //                   {modalsCopy.delete.description}
  //                 </p>
  //               </ModalHeader>
  //               <ModalBody className="px-4">
  //                 <div className="flex w-full items-center justify-end gap-2 pt-3">
  //                   <Button
  //                     color="default"
  //                     variant="light"
  //                     onPress={() => {
  //                       clearAction();
  //                     }}
  //                   >
  //                     Annuler
  //                   </Button>
  //                   <Button
  //                     color="secondary"
  //                     onPress={() => {
  //                       deleteAppointment.mutate(
  //                         {
  //                           id: actionToPerform.id,
  //                         },
  //                         {
  //                           onSuccess: () => {
  //                             clearAction();
  //                             router.refresh();
  //                             toast.success("Rendez-vous supprimé avec succès");
  //                           },
  //                           onError: (error) => {
  //                             toast.error("Erreur lors de la suppression");
  //                           },
  //                         },
  //                       );
  //                     }}
  //                     isLoading={deleteAppointment.isPending}
  //                   >
  //                     {deleteAppointment.isPending
  //                       ? "Suppression..."
  //                       : "Supprimer"}
  //                   </Button>
  //                 </div>
  //               </ModalBody>
  //             </div>
  //           </div>
  //         </ModalContent>
  //       </Modal>
  //     );
  //   }
  //   return (
  //     <Modal
  //       isOpen={showActionModal}
  //       onClose={() => clearAction()}
  //       placement="center"
  //       backdrop="blur"
  //       size="lg"
  //       classNames={{
  //         base: "md:max-h-[85dvh]",
  //         wrapper: "overflow-hidden",
  //       }}
  //     >
  //       <ModalContent>
  //         <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
  //           <div className="rounded-md">
  //             <ModalHeader className="flex flex-col">
  //               {modalsCopy.delete.title}
  //               <p className="text-sm font-[450] text-default-500">
  //                 {modalsCopy.delete.description}
  //               </p>
  //             </ModalHeader>
  //             <ModalBody>
  //               <AppointmentForm
  //                 appointmentId={actionToPerform.id}
  //                 mode="edit"
  //                 onSuccess={() => {
  //                   clearAction();
  //                   router.refresh();
  //                 }}
  //                 onCancel={() => {
  //                   clearAction();
  //                 }}
  //               />
  //             </ModalBody>
  //           </div>
  //         </div>
  //       </ModalContent>
  //     </Modal>
  //   );
  // };

  return (
    <>
      <div className="w-full max-2xl:w-[calc(100dvw-385px)] max-xl:w-[calc(100dvw-380px)] max-lg:w-[calc(100dvw-340px)] max-md:w-[calc(100dvw-50px)] max-sm:w-[calc(100dvw-40px)] [@media(min-width:1536px)]:w-[calc(100dvw-380px)]">
        <Table
          aria-label="Rendez-vous Table"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[50vh] custom-scrollbar",
            tr: "rounded-small",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <>
                <p className="text-lg font-medium">Aucun rendez-vous trouvé</p>
              </>
            }
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {appointmentToModify && (
        <>
          <Modal
            shouldBlockScroll
            isOpen={isModifyModalOpen}
            onOpenChange={onModifyOpen}
            placement="center"
            backdrop="blur"
            size="lg"
            classNames={{
              base: "md:max-h-[85dvh]",
              wrapper: "overflow-hidden",
            }}
            onClose={() => {
              setAppointmentToModify(null);
            }}
          >
            <ModalContent>
              {(onClose) => (
                <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
                  <div className="rounded-md">
                    <ModalHeader className="flex flex-col gap-1">
                      Modifier le rendez-vous
                      <p className="text-sm font-[450] text-default-500">
                        Modifier les informations du rendez-vous en remplissant
                        le formulaire ci-dessous.
                      </p>
                    </ModalHeader>
                    <ModalBody>
                      <AppointmentForm
                        mode="edit"
                        appointmentId={appointmentToModify}
                        onSuccess={() => {
                          onClose();
                          setAppointmentToModify(null);
                          router.refresh();
                        }}
                        onCancel={() => {
                          setAppointmentToModify(null);
                          onClose();
                        }}
                      />
                    </ModalBody>
                  </div>
                </div>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
      {appointmentToDelete && (
        <>
          <Modal
            shouldBlockScroll
            isOpen={isDeleteModalOpen}
            onOpenChange={onDeleteOpenChange}
            placement="center"
            backdrop="blur"
            size="lg"
            classNames={{
              base: "md:max-h-[85dvh]",
              wrapper: "overflow-hidden",
            }}
            onClose={() => {
              setAppointmentToDelete(null);
            }}
          >
            <ModalContent>
              {(onClose) => (
                <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
                  <div className="rounded-md">
                    <ModalHeader className="flex flex-col">
                      Supprimer le rendez-vous
                      <p className="text-sm font-[450] text-default-500">
                        Êtes-vous sûr de vouloir supprimer ce rendez-vous?
                      </p>
                    </ModalHeader>
                    <ModalBody className="px-4">
                      <div className="flex w-full items-center justify-end gap-2 pt-3">
                        <Button
                          color="default"
                          variant="light"
                          onClick={() => {
                            setAppointmentToDelete(null);
                            onClose();
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          color="secondary"
                          onClick={async () => {
                            await deleteAppointment.mutateAsync(
                              {
                                id: appointmentToDelete,
                              },
                              {
                                onSuccess: () => {
                                  onClose();
                                  setAppointmentToDelete(null);
                                  toast.success(
                                    "Rendez-vous supprimé avec succès",
                                  );
                                  router.refresh();
                                },
                                onError: (error) => {
                                  toast.error(error.message);
                                },
                              },
                            );
                          }}
                          isLoading={deleteAppointment.isPending}
                        >
                          {deleteAppointment.isPending
                            ? "Suppression..."
                            : "Supprimer"}
                        </Button>
                      </div>
                    </ModalBody>
                  </div>
                </div>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}
