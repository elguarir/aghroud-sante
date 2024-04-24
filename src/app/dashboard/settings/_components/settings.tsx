"use client";
import React from "react";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import GeneralInformationForm from "./general-info-form";

type Props = {};

const Settings = (props: Props) => {
  return (
    <Tabs aria-label="Settings" defaultSelectedKey={"general"}>
      <Tab key="general" title="General Information">
        <Card shadow="sm" className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-start space-y-1 p-5 pb-2">
            <h3 className="text-large font-semibold leading-none tracking-tight">
              General Information
            </h3>
            <p className="text-small text-default-500">
              Update your general account information.
            </p>
          </CardHeader>
          <CardBody className="px-6 py-5">
            <GeneralInformationForm />
          </CardBody>
        </Card>
      </Tab>
      <Tab key="password" title="Password">
        <Card>
          <CardBody>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </CardBody>
        </Card>
      </Tab>
      <Tab key="notifications" title="Notifications">
        <Card>
          <CardBody>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
};

export default Settings;
