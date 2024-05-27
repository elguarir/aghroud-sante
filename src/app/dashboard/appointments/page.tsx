import Wrapper from "../_components/wrapper";
import { AddNewAppointmentModal } from "./_components/add-new-appointment";
import { getAllAppointments } from "@/server/api/routers/helpers/appointment";
import AppointmentsCalendar from "./_components/appointments-calendar";
import AppointmentsViewSwitch from "./_components/view-switch";
import { Body as TabBody, TabsProvider } from "@/components/ui/tabs";
import AppointmentsTable from "./_components/appointments-table";

const AppointmentsPage = async () => {
  const appointments = await getAllAppointments();

  return (
    <Wrapper>
      <TabsProvider defaultTab="table" className="grid w-full gap-4">
        <div className="flex h-full flex-col gap-4">
          <div className="flex w-full items-center justify-between gap-2">
            <h1 className="text-xl font-semibold md:text-2xl">Rendez-vous</h1>
            <div className="flex items-center gap-2">
              <AppointmentsViewSwitch />
              <AddNewAppointmentModal />
            </div>
          </div>
          <div className="flex h-full min-h-[78dvh] flex-1 flex-col pb-5 pt-7 shadow-sm">
            <TabBody key={"table"} value={"table"} className="h-full w-full">
              <AppointmentsTable appointments={appointments} />
            </TabBody>
            <TabBody
              key={"calendar"}
              value={"calendar"}
              className="h-full w-full"
            >
              <AppointmentsCalendar appointments={appointments} />
            </TabBody>
          </div>
        </div>
      </TabsProvider>
    </Wrapper>
  );
};

export default AppointmentsPage;
