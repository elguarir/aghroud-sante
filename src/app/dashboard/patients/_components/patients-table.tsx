"use client";
import React from "react";

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
import { MoreVertical } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { PatientData, columns } from "./patient-data";
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
import Link from "next/link";
import {
  CalendarPlusIcon,
  DocumentIcon,
  EditIcon,
  EyeFilledIcon,
  TrashIcon,
} from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { RegisterPatientModal } from "./register-new-patient";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import PatientForm from "./patient-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";

const INITIAL_VISIBLE_COLUMNS = [
  "patient",
  "dateOfBirth",
  "phoneNumber",
  "notes",
  "appointmentsCount",
  "createdAt",
  "actions",
];

interface PatientTableProps {
  patients: PatientData[];
}
export default function PatientTable({ patients }: PatientTableProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // actions related:
  const deletePatient = api.patient.delete.useMutation();

  const [patientToModify, setPatientToModify] = React.useState<number | null>(
    null,
  );
  const [patientToDelete, setPatientToDelete] = React.useState<number | null>(
    null,
  );
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

  const router = useRouter();

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);
  const hasSearchFilter = Boolean(filterValue);
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);
  const filteredItems = React.useMemo(() => {
    let filteredPatients = [...patients];

    if (hasSearchFilter) {
      filteredPatients = filteredPatients.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(filterValue.toLowerCase()) ||
          patient?.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
          patient?.phoneNumber
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          patient?.address?.toLowerCase().includes(filterValue.toLowerCase()) ||
          patient?.insuranceProvider
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          patient?.notes?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    return filteredPatients;
  }, [patients, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: PatientData, b: PatientData) => {
      const first = a[sortDescriptor.column as keyof PatientData] as number;
      const second = b[sortDescriptor.column as keyof PatientData] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (patient: PatientData, columnKey: React.Key) => {
      const cellValue = patient[columnKey as keyof PatientData];
      switch (columnKey) {
        case "patient":
          return (
            <User
              classNames={{
                base: "space-x-2",
              }}
              avatarProps={{
                radius: "lg",
                isBordered: true,
                src: `https://api.dicebear.com/8.x/initials/svg?fontSize=40&seed=${encodeURIComponent(patient.firstName + " " + patient.lastName)}`,
                getInitials(name) {
                  return name
                    .split(" ")
                    .map((n) => n[0])
                    .join("");
                },
              }}
              description={patient?.email}
              name={
                <p className="text-nowrap">
                  {patient.firstName + " " + patient.lastName}
                </p>
              }
            >
              {patient.email}
            </User>
          );
        case "dateOfBirth":
          return (
            <div className="flex w-fit flex-col">
              <p className="text-bold text-nowrap text-small capitalize">
                {patient?.dateOfBirth
                  ? patient.dateOfBirth.toLocaleDateString("fr-FR")
                  : "Non défini"}
              </p>
            </div>
          );
        case "phoneNumber":
          return (
            <div className="flex flex-col">
              {patient.phoneNumber ? (
                <>
                  <Link
                    href={`tel:${patient.phoneNumber}`}
                    className="text-bold text-small capitalize"
                  >
                    {patient.phoneNumber}
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-bold text-small capitalize">Non défini</p>
                </>
              )}
            </div>
          );
        case "address":
          return (
            <div className="flex flex-col whitespace-nowrap max-sm:min-w-40">
              <p className="text-bold truncate text-small capitalize">
                {patient.address || "Non défini"}
              </p>
            </div>
          );
        case "insuranceProvider":
          return (
            <div className="flex w-fit flex-col">
              <p className="text-bold text-small capitalize">
                {patient.insuranceProvider || "Non défini"}
              </p>
            </div>
          );
        case "notes":
          return (
            <div className="flex flex-col">
              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                  <Button
                    size="sm"
                    variant="light"
                    className="w-fit"
                    startContent={<EyeFilledIcon className="h-4 w-4" />}
                  >
                    Afficher
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Notes</div>
                    <div className="text-tiny">
                      {patient?.notes || "Aucune notes disponibles"}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          );
        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {patient.createdAt.toLocaleDateString("fr-FR")}
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-end gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <MoreVertical className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    startContent={<CalendarPlusIcon className="h-4 w-4" />}
                  >
                    Créer un rendez-vous
                  </DropdownItem>
                  <DropdownItem
                    startContent={<EditIcon className="h-4 w-4" />}
                    onPress={() => {
                      setPatientToModify(patient.id);
                      onModifyOpenChange();
                    }}
                  >
                    Modifier
                  </DropdownItem>
                  <DropdownItem
                    startContent={<DocumentIcon className="h-4 w-4" />}
                  >
                    Les documents
                  </DropdownItem>
                  <DropdownItem
                    color="danger"
                    startContent={<TrashIcon className="h-4 w-4" />}
                    onPress={() => {
                      setPatientToDelete(patient.id);
                      onDeleteOpenChange();
                    }}
                  >
                    Supprimer
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue?.toString() || "-";
      }
    },
    [],
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

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

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex flex-wrap items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Tous les patients sélectionnés"
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
          <div className="flex items-end justify-between gap-3">
            <Input
              isClearable
              variant="bordered"
              className="w-full sm:max-w-[44%] lg:max-w-[25%]"
              classNames={{
                inputWrapper:
                  "group-data-[focus=true]:border-primary !transition-all !duration-200",
              }}
              placeholder="Rechercher un patient"
              startContent={
                <SearchIcon className="h-5  w-5 text-default-500" />
              }
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <div className="flex gap-3">
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="flat"
                  >
                    Colonnes
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  color="primary"
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
              <RegisterPatientModal />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-small text-default-400">
              Total: {patients.length} patients
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
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    patients.length,
    hasSearchFilter,
  ]);

  return (
    <>
      <div className="w-full max-2xl:w-[calc(100dvw-400px)] max-xl:w-[calc(100dvw-440px)] max-lg:w-[calc(100dvw-340px)] max-md:w-[calc(100dvw-90px)] max-sm:w-[calc(100dvw-60px)] [@media(min-width:1536px)]:w-[calc(100dvw-400px)]">
        <Table
          aria-label="Patients Table"
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
                <p className="text-lg font-medium">Aucun patient trouvé</p>
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

      {patientToModify && (
        <>
          <Modal
            shouldBlockScroll
            isOpen={isModifyModalOpen}
            onOpenChange={onModifyOpen}
            placement="top-center"
            classNames={{
              base: "my-auto md:max-h-[85dvh]",
              wrapper: "overflow-hidden",
            }}
            onClose={() => {
              setPatientToModify(null);
            }}
          >
            <ModalContent>
              {(onClose) => (
                <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
                  <div className="rounded-md">
                    <ModalHeader className="flex flex-col gap-1">
                      Modifier le patient
                      <p className="text-sm font-[450] text-default-500">
                        Modifier les informations du patient en remplissant le
                        formulaire ci-dessous.
                      </p>
                    </ModalHeader>
                    <ModalBody>
                      <PatientForm
                        mode="edit"
                        patientId={patientToModify}
                        onSuccess={() => {
                          onClose();
                          setPatientToModify(null);
                          router.refresh();
                        }}
                        onCancel={() => {
                          setPatientToModify(null);
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

      {patientToDelete && (
        <>
          <Modal
            shouldBlockScroll
            isOpen={isDeleteModalOpen}
            onOpenChange={onDeleteOpenChange}
            placement="top-center"
            classNames={{
              base: "my-auto md:max-h-[85dvh]",
              wrapper: "overflow-hidden",
            }}
            onClose={() => {
              setPatientToDelete(null);
            }}
          >
            <ModalContent>
              {(onClose) => (
                <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
                  <div className="rounded-md">
                    <ModalHeader className="flex flex-col">
                      Supprimer le patient
                      <p className="text-sm font-[450] text-default-500">
                        Êtes-vous sûr de vouloir supprimer ce patient ?
                      </p>
                    </ModalHeader>
                    <ModalBody className="px-4">
                      <div className="flex w-full items-center justify-end gap-2 pt-3">
                        <Button
                          color="default"
                          variant="light"
                          onClick={() => {
                            setPatientToDelete(null);
                            onClose();
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          color="secondary"
                          onClick={async () => {
                            await deletePatient.mutateAsync(
                              { id: patientToDelete },
                              {
                                onSuccess: () => {
                                  onClose();
                                  setPatientToDelete(null);
                                  toast.success(
                                    "Patient supprimé avec succès",
                                    {
                                      duration: 1500,
                                    },
                                  );
                                  router.refresh();
                                },
                                onError: (error) => {
                                  toast.error(error.message, {
                                    duration: 1500,
                                  });
                                },
                              },
                            );
                          }}
                          isLoading={deletePatient.isPending}
                        >
                          {deletePatient.isPending
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

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
