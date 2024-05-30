"use client";
import { useState } from "react";
import Wrapper from "../_components/wrapper";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import * as Tab from "../../../components/ui/tabs";
import { FinanceReports } from "./_components/finance-reports";
import { PatientReports } from "./_components/patient-reports";
import { DateRange, DateRangePicker } from "@/components/ui/date-picker";
import { getLastMonthsRange, presets } from "@/lib/constants";

type Props = {};

const ReportsPage = (props: Props) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    ...getLastMonthsRange(1),
  });

  const tabs = [
    {
      title: "Finance",
      key: "finance",
      content: <FinanceReports dateRange={dateRange} />,
    },
    {
      title: "Rendez-vous",
      key: "rendez-vous",
      content: <div>Rendez-vous</div>,
    },
    {
      title: "Patients",
      key: "patients",
      content: <PatientReports />,
    },
  ];

  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-y-8">
        <div className="flex w-full items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">Rapports</h1>
            <p className="font-medium capitalize text-default-500">
              {format(new Date(), "EEEE, dd MMMM", {
                locale: fr,
              })}
            </p>
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col">
          <div className="flex min-h-[78dvh] w-full flex-col space-y-2">
            <Tab.Root defaultTab="finance" className="grid w-full gap-6">
              <div className="flex w-full flex-wrap items-center justify-between gap-4 @container">
                <Tab.List>
                  {tabs.map((tab) => (
                    <Tab.Item key={tab.key} title={tab.title} />
                  ))}
                </Tab.List>
                <div>
                  <DateRangePicker
                    presets={presets}
                    value={dateRange}
                    align="end"
                    onChange={setDateRange}
                    className="w-64 min-w-fit"
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
              </div>
              {/* content */}
              {tabs.map((tab) => (
                <Tab.Body
                  key={tab.key}
                  className="h-full w-full"
                  value={tab.key}
                >
                  {tab.content}
                </Tab.Body>
              ))}
            </Tab.Root>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ReportsPage;
