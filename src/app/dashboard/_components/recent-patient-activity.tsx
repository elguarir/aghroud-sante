"use client";
import React, { PropsWithChildren, ReactNode } from "react";
import * as Tab from "@/components/ui/tabs";
import { Button } from "@nextui-org/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { CalendarIcon, PatientsIcon } from "@/components/icons";
import { Chip } from "@nextui-org/chip";

type Props = {};

const Root = (props: PropsWithChildren) => {
  return (
    <Tab.Root defaultTab="rendez-vous" className="grid w-full gap-4">
      {props.children}
    </Tab.Root>
  );
};

const Body = ({ children, value }: { children: ReactNode; value: string }) => {
  const { activeTab } = Tab.useTabs();
  if (activeTab !== value) {
    return null;
  }
  return children;
};

interface HeaderProps {
  numberOfRecords?: {
    appointments: number;
    patients: number;
  };
}
const Header = ({ numberOfRecords }: HeaderProps) => {
  const { activeTab } = Tab.useTabs();
  const { appointments, patients } = numberOfRecords || {};
  const RecordBadge = (number?: number) => {
    if (number !== undefined && number > 0) {
      return (
        <Chip
          className="h-[22px] border border-default"
          variant="flat"
          size="sm"
        >
          <p className="text-tiny font-[550]">{number}</p>
        </Chip>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1 text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {activeTab === "rendez-vous" ? "Rendez-vous" : "Patients"}{" "}
          {activeTab === "rendez-vous" ? (
            <>{RecordBadge(appointments)}</>
          ) : (
            <>{RecordBadge(patients)}</>
          )}
          {/* <Chip className="border border-default h-[22px]" variant="flat" size="sm">
              <p className="text-tiny font-[550]">{numberOfRecords}</p>
            </Chip> */}
        </h3>
      </div>
      <Tab.List
        variant="solid"
        classNames={{
          cursor: "dark:bg-dark-tremor-background",
          tabList: "dark:bg-default-200",
        }}
      >
        <Tab.Item
          value="rendez-vous"
          key={"rendez-vous"}
          title={
            <>
              <CalendarIcon className="size-4 md:hidden" />
              <span className="max-md:hidden">Rendez-vous</span>
            </>
          }
        />
        <Tab.Item
          value="patients"
          key={"patients"}
          title={
            <>
              <PatientsIcon className="size-4 md:hidden" />
              <span className="max-md:hidden">Patients</span>
            </>
          }
        />
      </Tab.List>
    </div>
  );
};

const Footer = () => {
  const { activeTab } = Tab.useTabs();
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div>
        <p className="text-small text-tremor-background-muted dark:text-dark-tremor-background-muted">
          Affichage des{" "}
          {activeTab === "rendez-vous"
            ? "rendez-vous."
            : "patients récemment inscrit."}
        </p>
      </div>
      <Button
        variant="light"
        endContent={<ArrowRightIcon className="size-4" />}
        href={
          activeTab === "rendez-vous"
            ? "/dashboard/appointments"
            : "/dashboard/patients"
        }
        as={Link}
      >
        Voir tout
      </Button>
    </div>
  );
};

export { Root, Header, Footer, Body };
