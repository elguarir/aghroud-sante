import { getPayments } from "@/server/api/routers/helpers/payments";
import Wrapper from "../_components/wrapper";
import PaymentTable from "./_components/payments-table";
import { AddNewPaymentModal } from "./_components/add-new-payment";

type Props = {};

const RevenuePage = async (props: Props) => {
  const payments = await getPayments();
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-6">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Revenue</h1>
          <AddNewPaymentModal />
        </div>
        <div className="h-full">
          <PaymentTable payments={payments} />
        </div>
      </div>
    </Wrapper>
  );
};

export default RevenuePage;
