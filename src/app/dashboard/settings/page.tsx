import React from "react";
import Wrapper from "../_components/wrapper";
import Settings from "./_components/settings";

type Props = {};
const SettingsPage = async (props: Props) => {
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold md:text-2xl">Paramètres</h1>
        </div>
        <div className="flex h-full min-h-[78dvh] flex-1 flex-col">
          <Settings />
        </div>
      </div>
    </Wrapper>
  );
};

export default SettingsPage;
