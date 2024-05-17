"use client";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import GeneralInformationForm from "./general-info-form";
import PasswordForm from "./password-form";

type Props = {};

const Settings = (props: Props) => {
  return (
    <Tabs aria-label="Settings" defaultSelectedKey={"general"}>
      <Tab key="general" title="General Information">
        <Card shadow="sm" className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-start space-y-1 p-5 pb-2">
            <h3 className="text-large font-semibold leading-none tracking-tight">
              Informations générales
            </h3>
            <p className="text-small text-default-500">
              Mettez à jour les informations générales de votre compte.
            </p>
          </CardHeader>
          <CardBody className="px-6 py-5">
            <GeneralInformationForm />
          </CardBody>
        </Card>
      </Tab>
      <Tab key="password" title="Password">
        <Card shadow="sm" className="w-full max-w-2xl">
          <CardHeader className="flex flex-col items-start space-y-1 p-5 pb-2">
            <h3 className="text-large font-semibold leading-none tracking-tight">
              Mot de passe
            </h3>
            <p className="text-small text-default-500">
              Mettez à jour le mot de passe de votre compte.
            </p>
          </CardHeader>
          <CardBody className="px-6 py-5">
            <PasswordForm />
          </CardBody>
        </Card>
      </Tab>
      {/* <Tab key="notifications" title="Notifications">
        <Card>
          <CardBody>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </CardBody>
        </Card>
      </Tab> */}
    </Tabs>
  );
};

export default Settings;
