import React from "react";
import Wrapper from "../_components/wrapper";
import { Chart } from "./_components/Chart";

type Props = {};

const AppointmentsPage = (props: Props) => {
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Rapports</h1>
        </div>
        <div className="flex h-full min-h-[78dvh] flex-1 flex-col justify-center">
          <div className="grid w-full lg:grid-cols-2">
            <div>
              <Chart />
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default AppointmentsPage;
