"use client";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import GeneralInformationForm from "./general-info-form";
import PasswordForm from "./password-form";
import { api } from "@/trpc/react";
import { Spinner } from "@nextui-org/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@nextui-org/button";
import {
  ArrowLeftIcon,
  DotsVerticalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Avatar } from "@nextui-org/avatar";
import { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { EditIcon, TrashIcon } from "@/components/icons";
import TherapistForm from "../../_components/therapist-form";
import { toast } from "sonner";

type Props = {};

const Settings = (props: Props) => {
  return (
    <Tabs aria-label="Settings" defaultSelectedKey={"general"}>
      <Tab key="general" title="General Information">
        <Card shadow="sm" className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-start space-y-1 p-5 pb-2">
            <h3 className="text-large font-semibold leading-none tracking-tight">
              Informations générales
            </h3>
            <p className="text-small text-default-500">
              Mettez à jour les informations générales de votre compte.
            </p>
          </CardHeader>
          <CardBody className="px-6 py-5">
            <GeneralInformationForm />
          </CardBody>
        </Card>
      </Tab>
      <Tab key="password" title="Password">
        <Card shadow="sm" className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-start space-y-1 p-5 pb-2">
            <h3 className="text-large font-semibold leading-none tracking-tight">
              Mot de passe
            </h3>
            <p className="text-small text-default-500">
              Mettez à jour le mot de passe de votre compte.
            </p>
          </CardHeader>
          <CardBody className="px-6 py-5">
            <PasswordForm />
          </CardBody>
        </Card>
      </Tab>
      <Tab key="therapists" title="Médecins">
        <Card shadow="sm" className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-start space-y-1 p-5 pb-2">
            <h3 className="text-large font-semibold leading-none tracking-tight">
              Médecins
            </h3>
            <p className="text-small text-default-500">
              Liste des médecins enregistrés, vous pouvez les modifier ou les
              supprimer.
            </p>
          </CardHeader>
          <CardBody className="px-6 py-5">
            <TherapistsTable />
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
};

export default Settings;

interface TherapistMode {
  mode: "create" | "edit" | "delete";
  therapistId?: string;
}

const TherapistsTable = () => {
  const { data, isLoading } = api.therapist.getAll.useQuery();
  const [operation, setOperation] = useState<TherapistMode | null>(null);
  const deleteTherapist = api.therapist.delete.useMutation();
  const utils = api.useUtils();
  const refresh = () => {
    utils.therapist.getAll.invalidate();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 w-full items-center justify-center">
        <Spinner size="lg" color="current" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex w-full justify-between">
        <div>
          {operation && (
            <Button
              color="default"
              variant="light"
              size="sm"
              startContent={<ArrowLeftIcon />}
              onClick={() => {
                refresh();
                setOperation(null);
              }}
            >
              Retour
            </Button>
          )}
        </div>
        <div>
          {!operation && (
            <Button
              color="secondary"
              variant="solid"
              size="sm"
              startContent={<PlusIcon />}
              onClick={() =>
                setOperation({ mode: "create", therapistId: undefined })
              }
            >
              Ajouter un médecin
            </Button>
          )}
        </div>
      </div>
      <div className="min-h-[17.5rem] w-full">
        {operation?.mode &&
          (operation.mode === "create" || operation.mode === "edit") && (
            <TherapistForm
              onSuccess={() => {
                refresh();
                setOperation(null);
              }}
              onCancel={() => {
                refresh();
                setOperation(null);
              }}
              therapistId={operation.therapistId}
              mode={operation.mode}
            />
          )}
        {operation?.mode && operation.mode === "delete" && (
          <div className="w-full space-y-4">
            <div>
              <h3 className="text-xl font-[550]">
                Supprimer le médecin{" "}
                <span className="text-bold underline">
                  {data?.find((t) => t.id === operation.therapistId)?.name}
                </span>
              </h3>
              <p className="text-small font-[450] text-default-700">
                Êtes-vous sûr de vouloir supprimer ce médecin ?
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                color="default"
                variant="bordered"
                onClick={() => setOperation(null)}
              >
                Annuler
              </Button>
              <Button
                color="danger"
                variant="solid"
                isLoading={deleteTherapist.isPending}
                onClick={() => {
                  if (!operation.therapistId) return;
                  deleteTherapist.mutate(
                    {
                      id: operation.therapistId,
                    },
                    {
                      onSuccess: () => {
                        refresh();
                        toast.success("Rendez-vous supprimé avec succès");
                        setOperation(null);
                      },
                      onError: (error) => {
                        toast.error("Erreur lors de la suppression");
                      },
                    },
                  );
                }}
              >
                {deleteTherapist.isPending ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        )}
        {!operation && (
          <ScrollShadow
            className="h-full max-h-[17.5rem] w-[calc(100vw-77px)] overflow-x-auto md:w-[calc(100vw-370px)] lg:w-[calc(672px-48px)]"
            hideScrollBar
          >
            {data?.length === 0 ? (
              <div className="flex h-full min-h-64 w-full items-center justify-center">
                <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Aucun patient cette semaine
                </p>
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Nom</TableHeaderCell>
                    <TableHeaderCell>Spécialité</TableHeaderCell>
                    <TableHeaderCell>Insrit le</TableHeaderCell>
                    <TableHeaderCell>Action</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((therapist) => (
                    <TableRow key={therapist.id}>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-1.5 text-nowrap">
                          <Avatar
                            src={therapist.image}
                            alt={therapist.name}
                            size="sm"
                            name={therapist.name}
                            getInitials={(name) => {
                              return name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase();
                            }}
                            radius="full"
                          />
                          <p>{therapist.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex flex-col">
                          <p className="text-bold text-small capitalize">
                            {therapist.speciality ?? "Non défini"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex flex-col">
                          <p className="text-bold text-small capitalize">
                            {format(therapist.createdAt, "dd/MM/yyyy")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5" align="center">
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button
                              color="default"
                              variant="light"
                              isIconOnly
                              size="sm"
                            >
                              <DotsVerticalIcon className="size-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              startContent={<EditIcon className="h-4 w-4" />}
                              variant="flat"
                              onPress={() => {
                                setOperation({
                                  mode: "edit",
                                  therapistId: therapist.id,
                                });
                              }}
                            >
                              Modifier
                            </DropdownItem>

                            <DropdownItem
                              color="danger"
                              onPress={() => {
                                setOperation({
                                  mode: "delete",
                                  therapistId: therapist.id,
                                });
                              }}
                              startContent={<TrashIcon className="h-4 w-4" />}
                            >
                              {deleteTherapist.isPending
                                ? "Suppression..."
                                : "Supprimer"}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollShadow>
        )}
      </div>
    </div>
  );
};
