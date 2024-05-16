import Wrapper from "../_components/wrapper";
import { AddNewExpenseModal } from "./_components/add-new-expense";
import { getExpenses } from "@/server/api/routers/helpers/expenses";

type Props = {};

const DepensePage = async (props: Props) => {
  const expenses = await getExpenses();
  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="text-xl font-semibold md:text-2xl">Dépenses</h1>
          <AddNewExpenseModal />
        </div>
        <div className="flex h-full min-h-[78dvh] flex-1 flex-col pb-5 pt-7 shadow-sm">
          {/* <PaymentTable payments={payments} /> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default DepensePage;
