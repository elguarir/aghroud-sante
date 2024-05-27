"use client";
import React, { Key, useState } from "react";
import Wrapper from "../_components/wrapper";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import * as Tab from "../../../components/ui/tabs";
import { FinanceReports } from "./_components/finance-reports";
import { PatientReports } from "./_components/patient-reports";

type Props = {};

const ReportsPage = (props: Props) => {
  const [activeTab, setActiveTab] = useState<Key>("finance");

  const tabs = [
    {
      title: "Finance",
      key: "finance",
      content: <FinanceReports />,
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
            <Tab.Root defaultTab="finance" className="grid w-full gap-4">
              <div className="flex w-full items-center justify-between gap-4 @container">
                <Tab.List>
                  {tabs.map((tab) => (
                    <Tab.Item key={tab.key} title={tab.title} />
                  ))}
                </Tab.List>
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
