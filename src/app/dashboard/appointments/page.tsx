import React from "react";
import Wrapper from "../_components/wrapper";
import { AddNewAppointmentModal } from "./_components/add-new-appointment";
import AppointmentsTable from "./_components/appointments-table";
import { getAllAppointments } from "@/server/api/routers/helpers/appointment";

type Props = {};

const AppointmentsPage = async (props: Props) => {
  const appointments = await getAllAppointments()
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Rendez-vous</h1>
          <AddNewAppointmentModal />
        </div>
        <div className="flex h-full min-h-[78dvh] flex-1 flex-col pb-5 pt-7 shadow-sm">
          {/* <span className="max-w-[400px] text-center"></span> */}
          <AppointmentsTable appointments={appointments} />
        </div>
      </div>
    </Wrapper>
  );
};

export default AppointmentsPage;
