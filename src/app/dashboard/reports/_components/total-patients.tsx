import { UserGroupIcon } from "@/components/icons";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Card } from "@tremor/react";


const TotalPatientsCard = () => {
  return (
    <Card className="flex flex-col items-start gap-2 rounded-xl">
      <div>
        <UserGroupIcon className="h-8 w-8 text-default-600" />
      </div>
      <div className="flex w-full flex-col -space-y-0.5 leading-6">
        <span className="text-2xl font-bold tracking-tight text-default-600">
          150
        </span>
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm font-[450] text-default-500">
            Total Patient
          </div>
          <div className="flex h-full items-end">
            <Tooltip
              color="foreground"
              showArrow
              delay={150}
              closeDelay={100}
              content={
                <p className="text-tiny">
                  25% augmentation de patients <br />
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
                25%
              </Chip>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TotalPatientsCard;
