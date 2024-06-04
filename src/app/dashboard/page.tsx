import { endOfWeek, format, startOfWeek } from "date-fns";
import Wrapper from "./_components/wrapper";
import { Metadata } from "next";
import { fr } from "date-fns/locale";
import { Button } from "@nextui-org/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Await } from "@/lib/utils";
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
import WeekNavigation from "./_components/week-navigation";
import { parseAsIsoDateTime } from "nuqs/server";
import { Spinner } from "@nextui-org/spinner";
import { ActivityCard } from "./_components/activity-card";
import QuickActionsCard from "./_components/quick-actions-card";

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
              {format(start!, "dd, MMMM", {
                locale: fr,
                weekStartsOn: 1,
              })}{" "}
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
                      <div className="flex h-full min-h-72 w-full items-center justify-center">
                        <Spinner size="lg" color="current" />
                      </div>
                    }
                  >
                    <Await promise={activity}>
                      {({ patients, appointments }) => (
                        <>
                          <ActivityCard
                            appointments={appointments}
                            patients={patients}
                          />
                        </>
                      )}
                    </Await>
                  </Suspense>
                </Card>
                <Card className="rounded-xl p-5">
                  <div className="grid w-full gap-4 h-full">
                    {/* card header */}
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          Actions rapides
                        </h3>
                      </div>
                    </div>
                    {/* card content */}
                    <div className="pt-2">
                      <QuickActionsCard />
                    </div>
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
