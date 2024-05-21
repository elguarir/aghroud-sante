"use client";
import { AreaChart, Card } from "@tremor/react";

const chartdata = [
  {
    date: "Jan 23",
    Impressions: 167,
  },
  {
    date: "Feb 23",
    Impressions: 125,
  },
  {
    date: "Mar 23",
    Impressions: 156,
  },
  {
    date: "Apr 23",
    Impressions: 165,
  },
  {
    date: "May 23",
    Impressions: 153,
  },
  {
    date: "Jun 23",
    Impressions: 124,
  },
];

export function PatientReports() {
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
    <div className="grid w-full lg:grid-cols-2">
      <div>
        <Card className="max-md:px-4 max-md:py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Daily Impressions
            </h3>
          </div>
          <AreaChart
            className="h-72"
            data={chartdata}
            index="date"
            categories={["Impressions"]}
            colors={["blue"]}
            yAxisWidth={30}
          />
        </Card>
      </div>
    </div>
  );
}
