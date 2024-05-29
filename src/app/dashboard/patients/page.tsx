import React from "react";
import Wrapper from "../_components/wrapper";
import PatientsTable from "./_components/patients-table";
import { getAllPatients } from "@/server/api/routers/helpers/patient";
import { Metadata } from "next";
import { RegisterPatientModal } from "./_components/register-new-patient";

type Props = {};

export const metadata: Metadata = {
  title: "Patients",
  keywords: "Patients, Dashboard, Hospital, Management",
  description: "Patients page",
};

const PatientsPage = async (props: Props) => {
  let patients = await getAllPatients();

  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-6">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Patients</h1>
          <RegisterPatientModal />
        </div>
        <div className="h-full">
          <PatientsTable patients={patients} />
        </div>
      </div>
    </Wrapper>
  );
};

export default PatientsPage;
