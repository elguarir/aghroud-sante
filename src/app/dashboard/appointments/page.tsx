import React from "react";
import Wrapper from "../_components/wrapper";
import { CreateAppointmentModal } from "./_components/create-appointment";

type Props = {};

const AppointmentsPage = (props: Props) => {
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Rendez-vous</h1>
          {/* <CreateAppointmentModal /> */}
        </div>
        <div className="flex h-full min-h-[78dvh] flex-1 flex-col">
          <span className="max-w-[400px] text-center"></span>
        </div>
      </div>
    </Wrapper>
  );
};

export default AppointmentsPage;
