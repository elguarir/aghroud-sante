"use client";
import React, { Key, useState } from "react";
import Wrapper from "../_components/wrapper";
import { Spinner } from "@nextui-org/spinner";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import * as Tab from "./_components/tabs";
import { FinanceReports } from "./_components/FinanceReports";
import { PatientReports } from "./_components/PatientReports";
type Props = {};

// const FinanceReports = dynamic(
//   () =>
//     import("./_components/FinanceReports").then((mod) => mod.FinanceReports),
//   {
//     loading: () => (
//       <div className="flex min-h-[45dvh] w-full items-center justify-center">
//         <Spinner size="lg" color="current" />
//       </div>
//     ),
//   },
// );
// const PatientReports = dynamic(
//   () =>
//     import("./_components/PatientReports").then((mod) => mod.PatientReports),
//   {
//     loading: () => (
//       <div className="flex min-h-[45dvh] w-full items-center justify-center">
//         <Spinner size="lg" color="current" />
//       </div>
//     ),
//   },
// );

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
            <Tab.Root
              radius="full"
              defaultTab="finance"
              className="grid w-full gap-4"
            >
              <div className="flex w-full items-center justify-between gap-4 @container">
                <Tab.List
                  classNames={{
                    cursor: "dark:bg-dark-tremor-background",
                    tabList: "dark:bg-dark-tremor-background-subtle",
                  }}
                >
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
