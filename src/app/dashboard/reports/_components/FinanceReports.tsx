"use client";
import {
  MoneyBagIcon,
  MoneyReceiveSquareIcon,
  MoneySendSquareIcon,
  UserGroupIcon,
} from "@/components/icons";
import { Chip } from "@nextui-org/chip";
// import { Tab, Tabs } from "@nextui-org/tabs";
import * as Tab from "../_components/tabs";

import { Tooltip } from "@nextui-org/tooltip";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
// import { AreaChart, BarChart, Card } from "@tremor/react";
import { Card } from "@tremor/react";
import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/spinner";

const AreaChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.AreaChart),
  {
    loading: () => (
      <div className="flex min-h-72 w-full items-center justify-center">
        <Spinner size="lg" color="current" />
      </div>
    ),
  },
);

const BarChart = dynamic(
  () => import("@tremor/react").then((mod) => mod.BarChart),
  {
    loading: () => (
      <div className="flex min-h-72 w-full items-center justify-center">
        <Spinner size="lg" color="current" />
      </div>
    ),
  },
);


const data = [
  {
    date: "Jan",
    Dépenses: 1000,
    Revenu: 1400,
  },
  {
    date: "Feb",
    Dépenses: 650,
    Revenu: 1200,
  },
  {
    date: "Mar",
    Dépenses: 500,
    Revenu: 800,
  },
  {
    date: "Apr",
    Dépenses: 700,
    Revenu: 1500,
  },
  {
    date: "May",
    Dépenses: 1200,
    Revenu: 1500,
  },
  {
    date: "Jun",
    Dépenses: 650,
    Revenu: 1350,
  },
  {
    date: "Jul",
    Dépenses: 1000,
    Revenu: 1400,
  },
  {
    date: "Aug",
    Dépenses: 650,
    Revenu: 1200,
  },
  {
    date: "Sep",
    Dépenses: 500,
    Revenu: 800,
  },
  {
    date: "Oct",
    Dépenses: 700,
    Revenu: 1500,
  },
  {
    date: "Nov",
    Dépenses: 1200,
    Revenu: 1500,
  },
  {
    date: "Dec",
    Dépenses: 650,
    Revenu: 1350,
  },
];

export function FinanceReports() {
  let intervals = [
    {
      label: "Last 7 days",
      value: "7",
    },
    {
      label: "Last 30 days",
      value: "30",
    },
    {
      label: "Last 90 days",
      value: "90",
    },
  ];

  return (
    <div className="grid w-full gap-x-6 gap-y-8 xl:grid-cols-12">
      <div className="col-span-full">
        <div className="grid h-full w-full gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="flex flex-col items-start gap-2 rounded-xl">
            <div>
              <MoneyReceiveSquareIcon className="h-8 w-8 text-default-600" />
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col -space-y-0.5 leading-6">
                <span className="text-2xl font-bold tracking-tight text-default-600">
                  1,500 MAD
                </span>
                <span className="text-sm font-[450] text-default-500">
                  Revenu
                </span>
              </div>
              <div className="flex h-full items-end">
                <Tooltip
                  color="foreground"
                  showArrow
                  delay={150}
                  closeDelay={100}
                  content={
                    <p className="text-tiny">
                      Augmentation de 10 % de revenus <br />
                      par rapport au mois dernier
                    </p>
                  }
                >
                  <Chip
                    color="success"
                    variant="flat"
                    className="h-[1.55rem] select-none px-1.5"
                    startContent={<ArrowUpIcon className="h-4 w-4" />}
                  >
                    +10%
                  </Chip>
                </Tooltip>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col items-start gap-2 rounded-xl">
            <div>
              <MoneySendSquareIcon className="h-8 w-8 text-default-600" />
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col -space-y-0.5 leading-6">
                <span className="text-2xl font-bold tracking-tight text-default-600">
                  {/* random */}
                  900 MAD
                </span>
                <span className="text-sm font-[450] text-default-500">
                  Dépenses
                </span>
              </div>
              <div className="flex h-full items-end">
                <Tooltip
                  color="foreground"
                  showArrow
                  delay={150}
                  closeDelay={100}
                  content={
                    <p className="text-tiny">
                      -10% de dépenses <br />
                      par rapport au mois dernier
                    </p>
                  }
                >
                  <Chip
                    color="danger"
                    variant="flat"
                    className="h-[1.55rem] select-none px-1.5"
                    startContent={<ArrowDownIcon className="h-4 w-4" />}
                  >
                    -10%
                  </Chip>
                </Tooltip>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col items-start gap-2 rounded-xl">
            <div>
              <UserGroupIcon className="h-8 w-8 text-default-600" />
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col -space-y-0.5 leading-6">
                <span className="text-2xl font-bold tracking-tight text-default-600">
                  150
                </span>
                <span className="text-sm font-[450] text-default-500">
                  Total Patient
                </span>
              </div>
              <div className="flex h-full items-end">
                <Tooltip
                  color="foreground"
                  showArrow
                  delay={150}
                  closeDelay={100}
                  content={
                    <p className="text-tiny">
                      25% augmentation de patients <br />
                      par rapport au mois dernier
                    </p>
                  }
                >
                  <Chip
                    color="success"
                    variant="flat"
                    className="h-[1.55rem] select-none px-1.5"
                    startContent={<ArrowUpIcon className="h-4 w-4" />}
                  >
                    25%
                  </Chip>
                </Tooltip>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Card className="col-span-full min-h-[25rem] max-md:px-4 max-md:py-5 xl:col-span-6 rounded-xl">
        <Tab.Root
          radius="full"
          defaultTab="finance"
          className="grid w-full gap-4"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Revenus mensuels
              </h3>
            </div>
            {/* <div className="bg-dark-tremor-background bg-dark-tremor-background-subtle bg-tremor-background"></div> */}
            <Tab.List
              classNames={{
                cursor: "dark:bg-dark-tremor-background",
                tabList: "dark:bg-dark-tremor-background-subtle",
              }}
            >
              <Tab.Item key={"bar"} title="Bar" />
              <Tab.Item key={"line"} title="Line" />
            </Tab.List>
          </div>
          {/* content */}
          <Tab.Body key={"bar"} value={"bar"} className="h-full w-full">
            <BarChart
              className="h-72"
              data={data}
              index="date"
              showAnimation
              categories={["Revenu", "Dépenses"]}
              colors={["blue", "orange"]}
              yAxisWidth={40}
            />
          </Tab.Body>
          <Tab.Body key={"line"} value={"line"} className="h-full w-full">
            <AreaChart
              className="h-72"
              data={data}
              index="date"
              showAnimation
              showGradient
              curveType="linear"
              categories={["Revenu", "Dépenses"]}
              colors={["blue", "orange"]}
              yAxisWidth={40}
            />
          </Tab.Body>
        </Tab.Root>
        {/* <Tabs size="sm" aria-label="Charts">
          <Tab key="bar" title="Bar">
            <AreaChart
              className="h-72"
              data={data}
              index="date"
              showAnimation
              showGradient
              curveType="linear"
              categories={["Revenu", "Dépenses"]}
              colors={["blue", "orange"]}
              yAxisWidth={40}
            />
          </Tab>
          <Tab key="line" title="Line">
            <BarChart
              className="h-72"
              data={data}
              index="date"
              showAnimation
              categories={["Revenu", "Dépenses"]}
              colors={["blue", "orange"]}
              yAxisWidth={40}
            />
          </Tab>
        </Tabs> */}
      </Card>
      <Card className="col-span-full min-h-[25rem] max-md:px-4 max-md:py-5 xl:col-span-6 rounded-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Revenu mensuelles
          </h3>
        </div>
        {/* <BarChart
          className="h-72"
          data={data}
          index="date"
          showAnimation
          categories={["Revenu", "Dépenses"]}
          colors={["blue", "orange"]}
          yAxisWidth={40}
        /> */}
      </Card>
      {/* <Card className="col-span-full max-md:px-4 max-md:py-5 xl:col-span-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Dépenses mensuelles
          </h3>
        </div>
        <div className="h-72"></div>
      </Card> */}
    </div>
  );
}
