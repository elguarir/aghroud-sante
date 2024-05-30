import { format } from "date-fns";
import Wrapper from "./_components/wrapper";
import { Metadata } from "next";
import { fr } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "This is the dashboard page",
  keywords: "dashboard, home, page",
};

const DashboardPage = () => {
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
          <span className="capitalize text-default-500">
            {format(new Date(), "MMMM dd, yyyy HH:mm", { locale: fr })}
          </span>
        </div>
        <div className="flex h-full w-full flex-1"></div>
      </div>
    </Wrapper>
  );
};

export default DashboardPage;
