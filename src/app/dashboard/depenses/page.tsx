import Wrapper from "../_components/wrapper";

type Props = {};

const DepensePage = (props: Props) => {
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Dépenses</h1>
          {/* <CreateAppointmentModal /> */}
        </div>
        <div className="flex h-full min-h-[78dvh] flex-1 flex-col items-center justify-center rounded-lg border-[1.5px] border-dashed border-content3 p-5 shadow-sm">
          <span className="max-w-[400px] text-center"></span>
        </div>
      </div>
    </Wrapper>
  );
};

export default DepensePage;
