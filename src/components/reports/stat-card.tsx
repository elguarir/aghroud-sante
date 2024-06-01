import React from "react";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Card } from "@tremor/react";
import { Skeleton } from "@nextui-org/skeleton";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  currentValue: number;
  previousValue: number;
  isLoading?: boolean;
  hideComparison?: boolean;
  showPercentage?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  currentValue,
  previousValue,
  isLoading = false,
  hideComparison = false,
  showPercentage = true,
}) => {
  const percentageChange =
    previousValue !== 0
      ? ((currentValue - previousValue) / previousValue) * 100
      : 100;
  const difference = currentValue - previousValue;

  const isIncrease = percentageChange >= 0;

  if (isLoading)
    return (
      <Card className="flex flex-col items-start gap-2 rounded-xl py-4">
        <div>{icon}</div>
        <div className="flex w-full flex-col space-y-2 pt-1.5 leading-6">
          <Skeleton className="h-6 w-[75%] rounded-xl border border-default-600/5 !bg-default before:[animation-duration:_900ms_!important]" />
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-4 w-[45%] rounded-full border border-default-600/5 !bg-default text-sm font-[450] text-default-500 before:[animation-duration:_900ms_!important]" />
            <div className="flex h-full items-end">
              <Skeleton className="h-4 w-12 rounded-full border border-default-600/5 !bg-default before:[animation-duration:_900ms_!important]" />
            </div>
          </div>
        </div>
      </Card>
    );

  return (
    <Card className="flex flex-col items-start gap-2 rounded-xl py-4">
      <div>{icon}</div>
      <div className="flex w-full flex-col -space-y-0.5 leading-6">
        <span className="text-2xl font-[650] tabular-nums tracking-[0.020em] text-default-600">
          {new Intl.NumberFormat("us").format(currentValue)}{" "}
          {showPercentage && " MAD"}
        </span>
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm font-[450] text-default-500">
            {title}
          </div>
          {!hideComparison && (
            <div className="flex h-full items-end">
              <Tooltip
                color="foreground"
                showArrow
                delay={150}
                closeDelay={100}
                content={
                  <p className="text-tiny">
                    {isIncrease
                      ? `Augmentation de ${
                          showPercentage
                            ? `${percentageChange.toFixed(0)}%`
                            : `+${difference}`
                        }`
                      : `Diminution de ${
                          showPercentage
                            ? `${Math.abs(percentageChange).toFixed(0)}%`
                            : `${difference} ${title}`
                        }`}{" "}
                    <br />
                    par rapport au period dernier
                  </p>
                }
              >
                <Chip
                  color={isIncrease ? "success" : "danger"}
                  variant="flat"
                  className="h-[1.55rem] select-none px-1.5"
                  startContent={
                    <ArrowUpIcon
                      className={`h-4 w-4 transform ${
                        !isIncrease ? "rotate-180" : ""
                      }`}
                    />
                  }
                >
                  {showPercentage
                    ? `${isIncrease ? "+" : ""}${percentageChange.toFixed(0)}%`
                    : `${isIncrease ? "+" : ""}${difference}`}
                </Chip>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
