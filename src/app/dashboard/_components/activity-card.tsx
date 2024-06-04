"use client";
import * as Activity from "./recent-patient-activity";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/ui/table";
import { Chip } from "@nextui-org/chip";

import { RouterOutput } from "@/server/api/root";
import { format, isSameDay, isWithinInterval } from "date-fns";
import { AppointmentStatus } from "../appointments/_components/appointments-data";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";

function AppointmentRecord(appointment: RouterOutput["appointment"]["all"][0]) {
  let isOnGoing = isWithinInterval(new Date(), {
    start: appointment.startTime,
    end: appointment.endTime,
  });

  const status = AppointmentStatus.find(
    (st) => st.value === appointment.status,
  );

  return (
    <TableRow key={appointment.id}>
      <TableCell className="py-2.5">
        <div className="flex items-center text-nowrap">
          <p>
            {appointment.patient.firstName} {appointment.patient.lastName}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-2.5">
        <div className="flex flex-col">
          <div className="flex w-fit flex-nowrap items-center gap-1 text-nowrap capitalize">
            <Chip
              variant={"flat"}
              color={isOnGoing ? "success" : "default"}
              className={cn(
                "w-fit rounded-md border-default/40",
                !isOnGoing && "text-current",
              )}
            >
              {isSameDay(appointment.startTime, appointment.endTime) ? (
                <div className="flex flex-nowrap items-center gap-px">
                  {format(appointment.startTime, "dd/MM/yyyy, HH:mm")}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                  {format(appointment.endTime, "HH:mm")}
                </div>
              ) : (
                <div className="flex flex-nowrap items-center gap-px">
                  {format(appointment.startTime, "dd/MM/yyyy, HH:mm")}
                  <ArrowRightIcon className="h-4 w-4" />
                  {format(appointment.endTime, "dd/MM/yyyy, HH:mm")}
                </div>
              )}
            </Chip>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-2.5" align="center">
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{appointment.floor}</p>
        </div>
      </TableCell>

      <TableCell className="py-2.5">
        <div className="flex flex-col">
          {!status ? (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">Non défini</p>
            </div>
          ) : (
            <Chip
              radius="sm"
              startContent={<div className="pl-1">{status.icon}</div>}
              variant="flat"
              color={status.color}
            >
              {status.label}
            </Chip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
function PatientRecord(patient: RouterOutput["patient"]["getAll"][0]) {
  return (
    <TableRow key={patient.id}>
      <TableCell className="py-2.5">
        <div className="flex items-center text-nowrap">
          <p>
            {patient.firstName} {patient.lastName}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-2.5">
        <div className="flex flex-col">
          <div className="flex w-fit flex-nowrap items-center gap-1 text-nowrap capitalize">
            <Chip
              variant={"flat"}
              color={"default"}
              className={cn(
                "w-fit rounded-md border-default/40",
                "text-current",
              )}
            >
              {patient.dateOfBirth
                ? format(patient.dateOfBirth, "dd/MM/yyyy")
                : "Non défini"}
            </Chip>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-2.5" align="center">
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {patient.phoneNumber ?? "Non défini"}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-2.5">
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {format(patient.createdAt, "dd/MM/yyyy")}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ActivityCardProps {
  appointments: RouterOutput["appointment"]["all"];
  patients: RouterOutput["patient"]["getAll"];
}
export function ActivityCard({ appointments, patients }: ActivityCardProps) {
  return (
    <Activity.Root>
      <Activity.Header
        numberOfRecords={{
          appointments: appointments.length,
          patients: patients.length,
        }}
      />
      <div className="flex min-h-[16.5rem] flex-1 flex-col">
        <Activity.Body value="rendez-vous">
          <div className="flex h-full w-full items-center justify-center">
            <ScrollShadow
              className="h-full max-h-[15.5rem] w-[calc(100vw-77px)] overflow-x-auto md:w-[calc(100vw-370px)] lg:w-[calc(100vw/2-241px)]"
              hideScrollBar
            >
              {appointments.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Aucun rendez-vous cette semaine
                  </p>
                </div>
              ) : (
                <TableRoot className="custom-scrollbar h-full max-w-full">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Patient</TableHeaderCell>
                        <TableHeaderCell>Temps</TableHeaderCell>
                        <TableHeaderCell>Étage</TableHeaderCell>
                        <TableHeaderCell>Statut</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments
                        .sort(
                          (a, b) =>
                            b.startTime.getTime() - a.startTime.getTime(),
                        )
                        .map((appointment) => {
                          return (
                            <AppointmentRecord
                              key={appointment.id}
                              {...appointment}
                            />
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableRoot>
              )}
            </ScrollShadow>
          </div>
        </Activity.Body>
        <Activity.Body value="patients">
          <div className="flex h-full w-full items-center justify-center">
            <ScrollShadow
              className="h-full max-h-[15.5rem] w-[calc(100vw-77px)] overflow-x-auto md:w-[calc(100vw-370px)] lg:w-[calc(100vw/2-241px)]"
              hideScrollBar
            >
              {patients.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Aucun patient cette semaine
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Patient</TableHeaderCell>
                      <TableHeaderCell>Date naissance</TableHeaderCell>
                      <TableHeaderCell>Télé</TableHeaderCell>
                      <TableHeaderCell>Insrit le</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients
                      .sort(
                        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                      )
                      .map((patient) => {
                        return <PatientRecord {...patient} key={patient.id} />;
                      })}
                  </TableBody>
                </Table>
              )}
              <TableRoot className="custom-scrollbar h-full max-w-full"></TableRoot>
            </ScrollShadow>
          </div>
        </Activity.Body>
      </div>
      <div className="mt-auto">
        <Activity.Footer />
      </div>
    </Activity.Root>
  );
}
