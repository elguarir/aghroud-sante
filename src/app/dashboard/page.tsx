import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  startOfWeek,
} from "date-fns";
import Wrapper from "./_components/wrapper";
import { Metadata } from "next";
import { fr } from "date-fns/locale";
import { Button } from "@nextui-org/button";
import { ArrowRightIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { Await, cn } from "@/lib/utils";
import StatCard from "@/components/reports/stat-card";
import {
  CalendarIcon,
  MoneyReceiveSquareIcon,
  MoneySendSquareIcon,
  UserGroupIcon,
} from "@/components/icons";
import { Suspense } from "react";
import {
  getActivity,
  getSummary,
} from "@/server/api/routers/helpers/analytics";
import { Card } from "@tremor/react";
import * as Activity from "./_components/recent-patient-activity";
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
import { AppointmentStatus } from "./appointments/_components/appointments-data";
import WeekNavigation from "./_components/week-navigation";
import { parseAsIsoDateTime } from "nuqs/server";
import { Spinner } from "@nextui-org/spinner";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "This is the dashboard page",
  keywords: "dashboard, home, page",
};
interface Props {
  searchParams: {
    from: string;
    to: string;
  };
}

const DashboardPage = async ({ searchParams }: Props) => {
  const defaultStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const defaultEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const { from, to } = searchParams;
  const start =
    parseAsIsoDateTime
      .withDefault(defaultStart)
      .withOptions({ clearOnDefault: true })
      .parse(from) || defaultStart;
  const end =
    parseAsIsoDateTime
      .withDefault(defaultEnd)
      .withOptions({ clearOnDefault: true })
      .parse(to) || defaultEnd;

  const summaryData = getSummary(start, end);
  const activity = getActivity(start, end);

  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-8">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
            <span className="capitalize text-default-500">
              {format(start!, "dd, MMMM", { locale: fr, weekStartsOn: 1 })}{" "}
              <span className="lowercase">à</span>{" "}
              {format(end!, "dd, MMMM", { locale: fr, weekStartsOn: 1 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <WeekNavigation start={start} end={end} />
            <Button
              color="default"
              variant="flat"
              endContent={<ArrowRightIcon className="h-4 w-4" />}
            >
              Details
            </Button>
          </div>
        </div>
        <div className="flex h-full w-full flex-1">
          <div className="grid w-full gap-x-6 gap-y-10">
            <div className="col-span-full w-full">
              <div className="grid h-full w-full gap-6 md:grid-cols-2 xl:grid-cols-4">
                <Suspense
                  key={start.toString() + end.toString()}
                  fallback={
                    <>
                      {new Array(4).fill(0).map((_, i) => (
                        <StatCard
                          key={i}
                          icon={
                            <>
                              {i === 0 && (
                                <MoneyReceiveSquareIcon className="h-8 w-8 text-default-600" />
                              )}
                              {i === 1 && (
                                <MoneySendSquareIcon className="h-8 w-8 text-default-600" />
                              )}
                              {i === 2 && (
                                <UserGroupIcon className="h-8 w-8 text-default-600" />
                              )}
                              {i === 3 && (
                                <CalendarIcon className="h-8 w-8 text-default-600" />
                              )}
                            </>
                          }
                          title="Loading"
                          currentValue={0}
                          previousValue={0}
                          isLoading
                        />
                      ))}
                    </>
                  }
                >
                  <Await promise={summaryData}>
                    {({ current, previous, percentageChange }) => (
                      <>
                        <StatCard
                          icon={
                            <MoneyReceiveSquareIcon className="h-8 w-8 text-default-600" />
                          }
                          title="Revenu"
                          currentValue={current.totalRevenue ?? 0}
                          previousValue={previous.totalRevenue ?? 0}
                          hideComparison={percentageChange.totalRevenue === 0}
                        />
                        <StatCard
                          icon={
                            <MoneySendSquareIcon className="h-8 w-8 text-default-600" />
                          }
                          title={"Dépenses"}
                          hideComparison
                          currentValue={current.totalExpenses ?? 0}
                          previousValue={previous.totalExpenses ?? 0}
                        />
                        <StatCard
                          icon={
                            <UserGroupIcon className="h-8 w-8 text-default-600" />
                          }
                          title={"Total Patients"}
                          currentValue={current.totalPatients ?? 0}
                          previousValue={previous.totalPatients ?? 0}
                          showPercentage={false}
                          hideComparison={percentageChange.totalPatients === 0}
                        />
                        <StatCard
                          icon={
                            <CalendarIcon className="h-8 w-8 text-default-600" />
                          }
                          title={"Total Rendez-vous"}
                          currentValue={current.totalConfirmedAppointments ?? 0}
                          previousValue={
                            previous.totalConfirmedAppointments ?? 0
                          }
                          showPercentage={false}
                          hideComparison={
                            percentageChange.totalConfirmedAppointments === 0
                          }
                        />
                      </>
                    )}
                  </Await>
                </Suspense>
              </div>
            </div>
            <div className="col-span-full flex flex-col gap-6">
              <div className="w-full">
                <h2 className="text-lg font-semibold">
                  Activité de la semaine
                </h2>
              </div>
              <div className="grid h-full w-full gap-6 lg:grid-cols-2">
                <Card className="rounded-xl p-5">
                  <Suspense
                    key={start.toString() + end.toString()}
                    fallback={
                      <div className=" flex h-full min-h-72 w-full items-center justify-center">
                        <Spinner size="lg" color="current" />
                      </div>
                    }
                  >
                    <Await promise={activity}>
                      {({ patients, appointments }) => (
                        <>
                          <Activity.Root>
                            <Activity.Header
                              numberOfRecords={{
                                appointments: appointments.length,
                                patients: patients.length,
                              }}
                            />
                            <div className="flex min-h-[15.5rem] flex-1 flex-col">
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
                                              <TableHeaderCell>
                                                Patient
                                              </TableHeaderCell>
                                              <TableHeaderCell>
                                                Temps
                                              </TableHeaderCell>
                                              <TableHeaderCell>
                                                Étage
                                              </TableHeaderCell>
                                              <TableHeaderCell>
                                                Statut
                                              </TableHeaderCell>
                                              <TableHeaderCell>
                                                Action
                                              </TableHeaderCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {appointments
                                              .sort(
                                                (a, b) =>
                                                  b.startTime.getTime() -
                                                  a.startTime.getTime(),
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
                                            <TableHeaderCell>
                                              Patient
                                            </TableHeaderCell>
                                            <TableHeaderCell>
                                              Date naissance
                                            </TableHeaderCell>
                                            <TableHeaderCell>
                                              Télé
                                            </TableHeaderCell>
                                            <TableHeaderCell>
                                              Insrit le
                                            </TableHeaderCell>
                                            <TableHeaderCell>
                                              Action
                                            </TableHeaderCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {patients
                                            .sort(
                                              (a, b) =>
                                                b.createdAt.getTime() -
                                                a.createdAt.getTime(),
                                            )
                                            .map((patient) => {
                                              return (
                                                <PatientRecord
                                                  {...patient}
                                                  key={patient.id}
                                                />
                                              );
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
                        </>
                      )}
                    </Await>
                  </Suspense>
                </Card>
                <Card className="rounded-xl p-5">
                  <div className="grid w-full gap-4">
                    {/* card header */}
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          Patients récemment inscrits
                        </h3>
                      </div>
                    </div>
                    {/* card content */}
                    <div className="h-full min-h-80 w-full"></div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default DashboardPage;

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
      <TableCell className="py-2.5">
        <Button color="default" variant="light" isIconOnly size="sm">
          <DotsVerticalIcon className="size-4" />
        </Button>
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
      <TableCell className="py-2.5">
        <Button color="default" variant="light" isIconOnly size="sm">
          <DotsVerticalIcon className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
