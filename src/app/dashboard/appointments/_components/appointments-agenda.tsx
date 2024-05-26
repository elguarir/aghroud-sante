import { AppointmentStatus } from "@/lib/schemas/new-appointment";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/trpc/react";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React, { useState } from "react";
import { useCalendarStore } from "@/hooks/use-calendar-store";
// import { Accordion, AccordionItem } from "@nextui-org/react";
import * as Accordion from "@radix-ui/react-accordion";

interface Props {
  date: Date;
}

const AppointmentsAgenda = (props: Props) => {
  const { data: appointments, isLoading } =
    api.appointment.allWithFilter.useQuery({ date: props.date });
  const setCalendarAction = useCalendarStore(
    (state) => state.setCalendarAction,
  );

  if (isLoading) {
    return (
      <div className="flex h-52 w-full flex-col items-center justify-center pb-3 pt-8">
        <Spinner size="md" color="current" />
      </div>
    );
  }
  return (
    <div className="mb-2">
      <Accordion.Root
        className="flex w-full flex-col divide-y divide-default-200"
        type="single"
        collapsible
      >
        {appointments?.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </Accordion.Root>

      {appointments?.length === 0 && (
        <div className="space-y-3">
          <div className="flex h-28 w-full items-center justify-center">
            <span className="text-default-500">Aucun rendez-vous</span>
          </div>
          <div className="flex w-full justify-end">
            <Button
              color="primary"
              onClick={() => {
                setCalendarAction({ action: "create", date: props.date });
              }}
            >
              Ajouter un rendez-vous
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsAgenda;

const AppointmentCard = ({
  appointment,
}: {
  appointment: RouterOutput["appointment"]["allWithFilter"][0];
}) => {
  const status = AppointmentStatus.find(
    (status) => status.value === appointment.status,
  );

  let color = `bg-${status?.color}`;

  return (
    <Accordion.Item
      value={appointment.id}
      className="flex w-full flex-col gap-2 py-4"
    >
      <Accordion.Header>
        <Accordion.Trigger className="flex h-fit w-full items-center gap-2 text-default-700">
          <div className={`h-16 w-[3px] rounded-full ${color}`} />
          <div className="flex h-full flex-1 flex-col justify-start rounded-small p-2 transition-colors hover:bg-default-100">
            <div className="flex w-full items-center text-small font-medium text-default-500">
              <span>{format(new Date(appointment.startTime), "HH:mm")}</span>
              <ArrowRightIcon className="mx-1 h-4 w-4" />
              <span>{format(new Date(appointment.endTime), "HH:mm")}</span>
            </div>
            <div className="flex w-full items-center">
              <div className="font-semibold line-clamp-1 w-full text-left">
                {appointment.patient?.firstName} {appointment.patient?.lastName}
              </div>
            </div>
            <div className="mt-auto flex justify-end">
              <button className="rounded-sm text-tiny font-medium  text-primary underline focus-visible:outline-none">
                Détails
              </button>
            </div>
          </div>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down ml-3 h-20 rounded-small border border-default-200"></Accordion.Content>
    </Accordion.Item>
  );

  // return (
  //   <div className="flex h-28 w-full items-center gap-2 py-4 text-default-700">
  //     <div className={`h-full w-[3px] rounded-full ${color}`} />
  //     <div className="flex h-full flex-1 flex-col justify-start rounded-small p-2 transition-colors hover:bg-default-100">
  //       <div className="flex w-full items-center text-small font-medium text-default-500">
  //         <span>{format(new Date(appointment.startTime), "HH:mm")}</span>
  //         <ArrowRightIcon className="mx-1 h-4 w-4" />
  //         <span>{format(new Date(appointment.endTime), "HH:mm")}</span>
  //       </div>
  //       <div className="flex w-full items-center">
  //         <div className="font-semibold">
  //           {appointment.patient?.firstName} {appointment.patient?.lastName}
  //         </div>
  //       </div>
  //       <div className="mt-auto flex justify-end">
  //         <button
  //           onClick={() => setShowDetails(!showDetails)}
  //           className="rounded-sm text-tiny font-medium  text-primary underline focus-visible:outline-none"
  //         >
  //           {showDetails ? "Cacher" : "Détails"}
  //         </button>
  //       </div>
  //     </div>
  //   </div>

  // return (
  //   <AccordionItem
  //     key={appointment.id}
  //     classNames={{
  //       base: "p-0 rounded-small border border-default-200",
  //       titleWrapper: "title-wrapper",
  //       trigger: "p-0 rounded-small flex gap-0",
  //     }}
  //     indicator={<div className="hidden"></div>}
  //     title={
  //       <>
  //         <div className="flex h-full flex-1 flex-col justify-start rounded-small p-2 transition-colors hover:bg-default-100">
  //           <div className="flex w-full items-center text-small font-medium text-default-500">
  //             <span>{format(new Date(appointment.startTime), "HH:mm")}</span>
  //             <ArrowRightIcon className="mx-1 h-4 w-4" />
  //             <span>{format(new Date(appointment.endTime), "HH:mm")}</span>
  //           </div>
  //           <div className="flex w-full items-center">
  //             <div className="font-semibold">
  //               {appointment.patient?.firstName} {appointment.patient?.lastName}
  //             </div>
  //           </div>
  //           <div className="mt-auto flex justify-end">
  //             <button
  //               onClick={() => setShowDetails(!showDetails)}
  //               className="rounded-sm text-tiny font-medium  text-primary underline focus-visible:outline-none"
  //             >
  //               {showDetails ? "Cacher" : "Détails"}
  //             </button>
  //           </div>
  //         </div>
  //       </>
  //     }
  //   >
  //     <div className="h-20 w-full rounded-small"></div>
  //   </AccordionItem>
};
