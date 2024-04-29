import React from "react";
import Wrapper from "../_components/wrapper";
import { RegisterPatientModal } from "./_components/register-new-patient";
import PatientsTable from "./_components/patients-table";
// import PatientsTable from "./_components/users-table";

type Props = {};

const PatientsPage = (props: Props) => {
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-lg font-semibold md:text-2xl">Patients</h1>
          <RegisterPatientModal />
        </div>
        <div className="mt-6 flex h-full min-h-[75dvh] flex-1 flex-col items-center rounded-lg border-[1.5px] border-dashed border-content3 p-5 shadow-sm">
          {/* <p className="text-lg font-semibold  text-content2-foreground">
            Aucun patient trouvé
          </p>
          <p className="text-sm text-center text-content2-foreground">
            Cliquez sur "Ajouter un patient" pour enregistrer un nouveau patient
          </p> */}
          <PatientsTable />
        </div>
      </div>
    </Wrapper>
  );
};

export default PatientsPage;
