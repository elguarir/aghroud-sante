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
import { CircleFadingPlus, MoreVertical } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { columns, ExpenseData, ExpenseTypes } from "./expense-data";
import { Button, ButtonGroup } from "@nextui-org/button";
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
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { format, isSameDay } from "date-fns";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import ExpenseForm from "./expense-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Divider } from "@nextui-org/divider";
import { DateValue, RangeCalendar, RangeValue } from "@nextui-org/calendar";
import {
  getLocalTimeZone,
  today,
  startOfMonth,
  endOfMonth,
} from "@internationalized/date";

const INITIAL_VISIBLE_COLUMNS = [
  "label",
  "amount",
  "type",
  "notes",
  "expenseDate",
  "actions",
];

interface ExpenseTableProps {
  expenses: ExpenseData[];
}
export default function ExpenseTable({ expenses }: ExpenseTableProps) {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );

  // Handling modals
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
  const [ExpenseToModify, setExpenseToModify] = React.useState<string | null>(
    null,
  );
  const [ExpenseToDelete, setExpenseToDelete] = React.useState<string | null>(
    null,
  );
  const deleteExpense = api.expense.delete.useMutation();

  // Filters
  const [expenseFilters, setExpenseFilters] = React.useState<Selection>(
    new Set([]),
  );
  let [dateFilter, setDateFilter] = React.useState<RangeValue<DateValue>>({
    start: startOfMonth(today(getLocalTimeZone())),
    end: endOfMonth(today(getLocalTimeZone())),
  });
  const hasSearchFilter = Boolean(filterValue);
  const hasDateFilter = dateFilter.start && dateFilter.end;
  const hasExpenseFilter = Boolean(Array.from(expenseFilters).length > 0);

  // Columns, Rows per page, Sort
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "expenseDate",
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
    let filteredExpenses = [...expenses];

    if (hasSearchFilter) {
      filteredExpenses = filteredExpenses.filter((expense) => {
        return (
          expense
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          format(expense.expenseDate, "dd/MM/yyyy, HH:mm")
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      });
    }

    if (hasExpenseFilter) {
      filteredExpenses = filteredExpenses.filter((expense) => {
        if (expense.type) {
          return Array.from(expenseFilters).includes(expense.type);
        }
        return false;
      });
    }

    if (hasDateFilter) {
      let isSameDayFilter = isSameDay(
        dateFilter.start.toDate(getLocalTimeZone()),
        dateFilter.end.toDate(getLocalTimeZone()),
      );
      if (isSameDayFilter) {
        filteredExpenses = filteredExpenses.filter((expense) => {
          return isSameDay(
            expense.expenseDate,
            dateFilter.start.toDate(getLocalTimeZone()),
          );
        });
      } else {
        filteredExpenses = filteredExpenses.filter((expense) => {
          return (
            expense.expenseDate >=
              dateFilter.start.toDate(getLocalTimeZone()) &&
            expense.expenseDate <= dateFilter.end.toDate(getLocalTimeZone())
          );
        });
      }
    }

    return filteredExpenses;
  }, [expenses, filterValue, expenseFilters, dateFilter]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ExpenseData, b: ExpenseData) => {
      const first = a[sortDescriptor.column as keyof ExpenseData] as number;
      const second = b[sortDescriptor.column as keyof ExpenseData] as number;
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

  // Handlers
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
    (expense: ExpenseData, columnKey: React.Key) => {
      const cellValue = expense[columnKey as keyof ExpenseData];
      switch (columnKey) {
        case "label":
          return (
            <div className="flex max-w-[130px] flex-col">
              <p className="text-bold truncate text-nowrap text-small capitalize">
                {expense.label}
              </p>
            </div>
          );
        case "amount": {
          let formattedAmount = new Intl.NumberFormat("fr-MA", {
            style: "currency",
            currency: "MAD",
            maximumFractionDigits: 1,
            compactDisplay: "short",
          }).format(expense.amount);
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {formattedAmount}
              </p>
            </div>
          );
        }
        case "type": {
          const expensetype = ExpenseTypes.find(
            (type) => type.value === expense.type,
          );
          if (!expensetype)
            return (
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">Non défini</p>
              </div>
            );
          return (
            <div className="flex flex-col">
              {/* <p className="text-bold text-small capitalize">
              </p> */}
              <Chip variant="faded" radius="sm" color="secondary">
                {expensetype?.label}
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
                      {expense?.notes || "Aucune notes disponibles"}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          );
        case "expenseDate": {
          return (
            <div className="flex flex-col">
              <p className="text-bold text-nowrap text-small capitalize">
                {format(expense.expenseDate, "dd/MM/yyyy, HH:mm")}
              </p>
            </div>
          );
        }
        case "actions":
          return (
            <>
              <div className="relative flex items-center justify-end gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <MoreVertical className="text-default-300" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      startContent={<EditIcon className="h-4 w-4" />}
                      onPress={() => {
                        setExpenseToModify(expense.id);
                        onModifyOpen();
                      }}
                    >
                      Modifier
                    </DropdownItem>
                    <DropdownItem
                      color="danger"
                      onPress={() => {
                        setExpenseToDelete(expense.id);
                        onDeleteOpen();
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
        case "type": {
          const expenseFiltersArray = Array.from(expenseFilters);
          if (expenseFiltersArray.length > 0) {
            return (
              <>
                <Divider orientation="vertical" className="h-[60%] w-[0.9px]" />
                <div className="flex items-center gap-1">
                  {expenseFiltersArray.length <= 2 ? (
                    <>
                      {expenseFiltersArray.map((type) => (
                        <Chip
                          key={type}
                          variant="faded"
                          radius="sm"
                          color="secondary"
                        >
                          {ExpenseTypes.find((t) => t.value === type)?.label}
                        </Chip>
                      ))}
                    </>
                  ) : (
                    <div>
                      <Chip variant="faded" radius="sm" color="secondary">
                        {expenseFiltersArray.length} Séléctionnés
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
        case "expenseDate": {
          if (hasDateFilter) {
            return (
              <>
                <Divider orientation="vertical" className="h-[60%] w-[0.9px]" />
                <div className="flex items-center gap-1">
                  {dateFilter.start.toString() === dateFilter.end.toString() ? (
                    <Chip variant="faded" radius="sm" color="secondary">
                      {format(dateFilter.start.toString(), "dd/MM/yyyy")}
                    </Chip>
                  ) : (
                    <Chip variant="faded" radius="sm" color="secondary">
                      <div className="flex w-fit flex-row items-center gap-1.5">
                        {format(dateFilter.start.toString(), "dd/MM/yyyy")}
                        <ArrowRightIcon className="h-4 w-4" />
                        {format(dateFilter.end.toString(), "dd/MM/yyyy")}
                      </div>
                    </Chip>
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
    [expenseFilters, dateFilter],
  );

  const RenderModals = React.useCallback(() => {
    return (
      <>
        {ExpenseToModify && (
          <>
            <Modal
              shouldBlockScroll
              isOpen={isModifyModalOpen}
              onOpenChange={onModifyOpen}
              placement="center"
        backdrop="blur"
              classNames={{
                base: "md:max-h-[85dvh]",
                wrapper: "overflow-hidden",
              }}
              onClose={() => {
                setExpenseToModify(null);
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
                    <div className="rounded-md">
                      <ModalHeader className="flex flex-col gap-1">
                        Modifier le dépense
                        <p className="text-sm font-[450] text-default-500">
                          Modifiez les informations du dépense.
                        </p>
                      </ModalHeader>
                      <ModalBody>
                        <ExpenseForm
                          mode="edit"
                          expenseId={ExpenseToModify}
                          onSuccess={() => {
                            onClose();
                            setExpenseToModify(null);
                            router.refresh();
                          }}
                          onCancel={() => {
                            setExpenseToModify(null);
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
        {ExpenseToDelete && (
          <>
            <Modal
              shouldBlockScroll
              isOpen={isDeleteModalOpen}
              onOpenChange={onDeleteOpenChange}
              placement="center"
        backdrop="blur"
              classNames={{
                base: "md:max-h-[85dvh]",
                wrapper: "overflow-hidden",
              }}
              onClose={() => {
                setExpenseToDelete(null);
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
                    <div className="rounded-md">
                      <ModalHeader className="flex flex-col">
                        Supprimer le dépense
                        <p className="text-sm font-[450] text-default-500">
                          Êtes-vous sûr de vouloir supprimer ce dépense ?
                        </p>
                      </ModalHeader>
                      <ModalBody className="px-4">
                        <div className="flex w-full items-center justify-end gap-2 pt-3">
                          <Button
                            color="default"
                            variant="light"
                            onClick={() => {
                              setExpenseToDelete(null);
                              onClose();
                            }}
                          >
                            Annuler
                          </Button>
                          <Button
                            color="secondary"
                            onClick={async () => {
                              await deleteExpense.mutateAsync(
                                { id: ExpenseToDelete },
                                {
                                  onSuccess: () => {
                                    onClose();
                                    setExpenseToDelete(null);
                                    toast.success(
                                      "Dépense supprimé avec succès",
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
                            isLoading={deleteExpense.isPending}
                          >
                            {deleteExpense.isPending
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
  }, [isModifyModalOpen, isDeleteModalOpen, ExpenseToModify, ExpenseToDelete]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex flex-wrap items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Tous les dépenses sélectionnés"
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
          <div className="custom-scrollbar flex w-full items-end justify-between gap-6 overflow-x-auto py-2">
            <div className="flex w-full min-w-fit items-center gap-2">
              <Input
                isClearable
                variant="bordered"
                className="w-full min-w-[300px] max-w-[350px]"
                classNames={{
                  inputWrapper:
                    "group-data-[focus=true]:border-primary !transition-all !duration-200",
                }}
                placeholder="Rechercher un dépense..."
                startContent={
                  <SearchIcon className="h-5 w-5 text-default-500" />
                }
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
              />
              <div className="flex min-w-fit items-center gap-2">
                {/* Type Filter */}
                <Popover
                  triggerScaleOnOpen={false}
                  placement="bottom-start"
                  offset={10}
                >
                  <PopoverTrigger>
                    <Button
                      disableAnimation
                      startContent={
                        <CircleFadingPlus className="h-4 w-4 text-default-500" />
                      }
                      endContent={<RenderFilters filter="type" />}
                      color="default"
                      variant="bordered"
                    >
                      Type
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[200px] rounded-small p-1 pb-1.5">
                    <div className="flex w-full flex-col gap-2">
                      <Listbox
                        variant="flat"
                        selectionMode="multiple"
                        selectedKeys={expenseFilters}
                        onSelectionChange={setExpenseFilters}
                      >
                        {ExpenseTypes.map((type) => (
                          <ListboxItem key={type.value}>
                            {type.label}
                          </ListboxItem>
                        ))}
                      </Listbox>
                      {hasExpenseFilter && (
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
                                setExpenseFilters(new Set([]));
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
                <Popover
                  triggerScaleOnOpen={false}
                  placement="bottom"
                  offset={10}
                >
                  <PopoverTrigger>
                    <Button
                      disableAnimation
                      startContent={
                        <CircleFadingPlus className="h-4 w-4 text-default-500" />
                      }
                      endContent={<RenderFilters filter="expenseDate" />}
                      color="default"
                      variant="bordered"
                    >
                      Date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[200px] rounded-small border-none p-0 shadow-none">
                    <div className="flex flex-col gap-2">
                      <RangeCalendar
                        aria-label="Paiment Date Range"
                        value={dateFilter}
                        classNames={{
                          title: "capitalize",
                        }}
                        onChange={setDateFilter}
                        topContent={
                          <ButtonGroup
                            fullWidth
                            className="max-w-full bg-content1 px-3 pb-2 pt-3 [&>button]:border-default-200/60 [&>button]:text-default-500"
                            radius="full"
                            size="sm"
                            variant="bordered"
                          >
                            <Button
                              onPress={() => {
                                setDateFilter({
                                  start: startOfMonth(
                                    today(getLocalTimeZone()),
                                  ),
                                  end: endOfMonth(today(getLocalTimeZone())),
                                });
                              }}
                            >
                              Mois en cours
                            </Button>
                            <Button
                              onPress={() => {
                                setDateFilter({
                                  start: startOfMonth(
                                    today(getLocalTimeZone()),
                                  ).subtract({ months: 1 }),
                                  end: endOfMonth(
                                    today(getLocalTimeZone()),
                                  ).subtract({ months: 1 }),
                                });
                              }}
                            >
                              Mois précédent
                            </Button>
                          </ButtonGroup>
                        }
                        bottomContent={
                          <>
                            <div>
                              <Button
                                size="sm"
                                variant="light"
                                color="default"
                                radius="none"
                                fullWidth
                                onPress={() => {
                                  setDateFilter({
                                    start: startOfMonth(
                                      today(getLocalTimeZone()),
                                    ),
                                    end: endOfMonth(today(getLocalTimeZone())),
                                  });
                                }}
                              >
                                Réinitialiser
                              </Button>
                            </div>
                          </>
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
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
          <div className="flex items-center justify-between">
            <span className="text-small text-default-400">
              Total: {expenses.length} dépenses
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
    expenseFilters,
    visibleColumns,
    dateFilter,
    onSearchChange,
    onRowsPerPageChange,
    expenses.length,
    hasSearchFilter,
  ]);

  return (
    <div className="w-full max-2xl:w-[calc(100dvw-385px)] max-xl:w-[calc(100dvw-380px)] max-lg:w-[calc(100dvw-340px)] max-md:w-[calc(100dvw-50px)] max-sm:w-[calc(100dvw-40px)] [@media(min-width:1536px)]:w-[calc(100dvw-380px)]">
      <Table
        aria-label="Dépenses Table"
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
              <p className="text-lg font-medium">Aucun dépense trouvé</p>
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
      <RenderModals />
    </div>
  );
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
