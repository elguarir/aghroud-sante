import { Button } from "@nextui-org/button";
import Wrapper from "./_components/wrapper";

const DashboardPage = () => {
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
        </div>
        <div className="flex min-h-[78dvh] h-full flex-1 flex-col items-center justify-center rounded-lg border-[1.5px] border-dashed border-content3 p-5 shadow-sm">
          <span className="max-w-[400px] text-center">
            This is the dashboard page. You can start building your app from
            here.
          </span>
          <Button color="secondary">
            Go to Reports
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default DashboardPage;
