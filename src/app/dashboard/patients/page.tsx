import React from "react";
import Wrapper from "../_components/wrapper";
import PatientsTable from "./_components/patients-table";
import { getAllPatients } from "@/server/api/routers/helpers/patient";

type Props = {};

const PatientsPage = async (props: Props) => {
  let patients = await getAllPatients();

  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Patients</h1>
        </div>
        <div className="my-8 p-0 w-full flex h-full min-h-[75dvh] flex-1 flex-col items-center md:p-5 shadow-sm">
          <PatientsTable patients={patients} />
        </div>
      </div>
    </Wrapper>
  );
};

export default PatientsPage;
