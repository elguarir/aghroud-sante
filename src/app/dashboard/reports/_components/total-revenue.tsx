import { MoneyReceiveSquareIcon, UserGroupIcon } from "@/components/icons";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Card } from "@tremor/react";

const TotalRevenueCard = () => {
  return (
    <Card className="flex py-4 flex-col items-start gap-2 rounded-xl">
      <div>
        <MoneyReceiveSquareIcon className="h-8 w-8 text-default-600" />
      </div>
      <div className="flex w-full flex-col -space-y-0.5 leading-6">
        <span className="text-2xl font-bold tracking-tight text-default-600">
          35,500 MAD
        </span>
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm font-[450] text-default-500">
            Revenu
          </div>
          <div className="flex h-full items-end">
            <Tooltip
              color="foreground"
              showArrow
              delay={150}
              closeDelay={100}
              content={
                <p className="text-tiny">
                  Augmentation de 10 % de revenus <br />
                  par rapport au mois dernier
                </p>
              }
            >
              <Chip
                color="success"
                variant="flat"
                className="h-[1.55rem] select-none px-1.5"
                startContent={<ArrowUpIcon className="h-4 w-4" />}
              >
                +10%
              </Chip>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TotalRevenueCard;
