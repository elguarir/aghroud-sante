"use client";
import {
  BarChartIcon,
  LineChartIcon,
  MoneyReceiveSquareIcon,
  MoneySendSquareIcon,
  UserGroupIcon,
} from "@/components/icons";
import * as Tab from "../../../../components/ui/tabs";
import { Card, Color, DonutChart } from "@tremor/react";
import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/spinner";
import { Select, SelectItem } from "@nextui-org/select";
import { colorValues } from "@/lib/constants";
import { ExpenseTypes } from "@/lib/schemas/new-expense";
import { eachDayOfInterval, format } from "date-fns";
import { fr } from "date-fns/locale";
import StatCard from "@/components/reports/stat-card";

/**
 *
 * Dynamic import for the AreaChart and BarChart components, this will help reduce the initial bundle size + only load the chart components when needed
 */
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

const dataFormatter = (number: number) =>
  new Intl.NumberFormat("us", {
    maximumFractionDigits: 0,
  }).format(number) + " MAD";

export function FinanceReports() {
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
  return (
    <div className="grid w-full gap-x-6 gap-y-8 xl:grid-cols-12">
      <div className="col-span-full">
        <div className="grid h-full w-full gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={
              <MoneyReceiveSquareIcon className="h-8 w-8 text-default-600" />
            }
            title="Revenu"
            currentValue={35500}
            previousValue={32000}
          />
          <StatCard
            icon={<MoneySendSquareIcon className="h-8 w-8 text-default-600" />}
            title={"Dépenses"}
            hideComparison
            currentValue={12000}
            previousValue={20000}
          />
          <StatCard
            icon={<UserGroupIcon className="h-8 w-8 text-default-600" />}
            title={"Total Patient"}
            currentValue={150}
            previousValue={120}
            showPercentage={false}
          />
        </div>
      </div>
      <Card className="col-span-full min-h-[25rem] rounded-xl max-md:px-4 max-md:py-5 xl:col-span-6">
        <Tab.Root defaultTab="line" className="grid w-full gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Revenus mensuels
              </h3>
            </div>
            <Tab.List
              classNames={{
                cursor: "dark:bg-dark-tremor-background",
                tabList: "dark:bg-default-200",
              }}
              size="sm"
              defaultSelectedKey={"line"}
            >
              <Tab.Item
                key={"line"}
                title={<LineChartIcon className="h-4 w-4" />}
              />
              <Tab.Item
                key={"bar"}
                title={<BarChartIcon className="h-4 w-4" />}
              />
            </Tab.List>
          </div>
          <Tab.Body key={"line"} value={"line"} className="h-full w-full">
            <AreaChart
              className="h-72"
              data={data}
              index="date"
              showAnimation
              showGradient
              curveType="natural"
              categories={["Revenu", "Dépenses"]}
              colors={["blue", "orange"]}
              yAxisWidth={40}
            />
          </Tab.Body>
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
        </Tab.Root>
      </Card>

      <ExpensesByCategoryChart />
    </div>
  );
}

interface LegendItemProps {
  color: Color;
  label: string;
  value: number;
  total: number;
  formatter: (number: number) => string;
}
const LegendItem = (props: LegendItemProps) => {
  const { label, total, value, color, formatter } = props;
  const tailwindColor = `bg-${color}-500`;

  return (
    <li className="flex w-full items-center justify-between space-x-6 py-2 text-tremor-default">
      <div className="flex items-center space-x-2.5 truncate">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-sm ${tailwindColor}`}
          aria-hidden="true"
        />
        <span className="truncate dark:text-dark-tremor-content-emphasis">
          {label}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {formatter(value)}
        </span>
        <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
          {((value / total) * 100).toFixed(1)}%
        </span>
      </div>
    </li>
  );
};

interface getLegendItemsProps {
  data: {
    name: string | undefined;
    value: number;
  }[];
  colors: Color[];
}
const getLegendItems = (props: getLegendItemsProps) => {
  const { data } = props;
  const total = data.reduce((acc, item) => acc + item.value, 0);
  return data
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      label: item.name,
      value: item.value,
      color: colorValues[index],
      total,
    }));
};

function ExpensesByCategoryChart() {
  let intervals = [
    {
      label: "3 Mois",
      value: "3",
    },
    {
      label: "6 Mois",
      value: "6",
    },
    {
      label: "9 Mois",
      value: "9",
    },
  ];

  const expensesByCategory = [
    {
      name: ExpenseTypes[0]?.label,
      value: 1200,
    },
    {
      name: ExpenseTypes[1]?.label,
      value: 8400,
    },
    {
      name: ExpenseTypes[2]?.label,
      value: 2000,
    },
    {
      name: ExpenseTypes[3]?.label,
      value: 450,
    },
    {
      name: ExpenseTypes[4]?.label,
      value: 12000,
    },
    {
      name: ExpenseTypes[5]?.label,
      value: 780,
    },
  ];

  const colors = colorValues.slice(0, expensesByCategory.length);

  const legendItems = getLegendItems({
    data: expensesByCategory,
    colors: colorValues as Color[],
  });

  return (
    <>
      <Card className="col-span-full min-h-[25rem] rounded-xl max-md:px-4 max-md:py-5 xl:col-span-6">
        <div className="flex h-full flex-col gap-3">
          <div className="flex w-full items-center justify-between">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Dépenses par catégorie
            </h3>
            <Select
              aria-label="Intervalle"
              placeholder="Intervalle"
              className="w-32"
              defaultSelectedKeys="3"
              variant="bordered"
              onChange={(e) => console.log(e.target.value)}
            >
              {intervals.map((interval) => (
                <SelectItem key={interval.value} value={interval.value}>
                  {interval.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="grid h-full w-full grid-cols-12 gap-y-4 max-md:mt-5">
            <div className="col-span-full flex h-full w-full items-center md:col-span-5">
              <DonutChart
                data={expensesByCategory}
                variant="donut"
                valueFormatter={dataFormatter}
                colors={colors}
                className="h-48 w-full"
              />
            </div>
            <div className="col-span-full flex h-full w-full flex-col justify-center px-3 md:col-span-7">
              <div className="flex w-full items-center justify-between text-tremor-label font-[450] text-tremor-content dark:text-dark-tremor-content">
                <span>Category</span>
                <span>Montant / Part</span>
              </div>
              <ul className="tremor-List-root mt-2 w-full divide-y divide-tremor-border text-tremor-content dark:divide-dark-tremor-border dark:text-dark-tremor-content">
                {legendItems.map((item, index) => (
                  <LegendItem
                    key={index}
                    color={colors[index] as Color}
                    label={item.label as string}
                    value={item.value}
                    total={item.total}
                    formatter={dataFormatter}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
