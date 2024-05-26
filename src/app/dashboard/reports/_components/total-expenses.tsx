import { MoneySendSquareIcon, UserGroupIcon } from "@/components/icons";
import { Card } from "@tremor/react";
const TotalExpensesCard = () => {
  return (
    <Card className="flex py-4 flex-col items-start gap-2 rounded-xl">
      <div>
        <MoneySendSquareIcon className="h-8 w-8 text-default-600" />
      </div>

      <div className="flex w-full flex-col -space-y-0.5 leading-6">
        <span className="text-2xl font-bold tracking-tight text-default-600">
          12,000 MAD
        </span>
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm font-[450] text-default-500">
            Dépenses
          </div>
          <div className="flex h-full items-end"></div>
        </div>
      </div>
    </Card>
  );
};

export default TotalExpensesCard;
