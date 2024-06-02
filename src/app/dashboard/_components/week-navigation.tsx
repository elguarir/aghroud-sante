"use client";
import { parseAsDate } from "@/lib/utils";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { endOfWeek, startOfWeek, addDays } from "date-fns";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { useTransition } from "react";

type Props = {
  start: Date;
  end: Date;
};

const WeekNavigation = ({ start, end }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useQueryStates(
    {
      from: parseAsIsoDateTime.withDefault(start),
      to: parseAsIsoDateTime.withDefault(end),
    },
    {
      history: "push",
      shallow: false,
      startTransition,
    },
  );

  const setNextWeek = () => {
    // calculate next week
    const nextWeek = addDays(new Date(date.from.setHours(15)), 7);
    setDate({ from: nextWeek, to: endOfWeek(nextWeek, { weekStartsOn: 1 }) });
  };

  const setPreviousWeek = () => {
    const previousWeek = addDays(new Date(date.from.setHours(15)), -7);
    setDate({
      from: previousWeek,
      to: endOfWeek(previousWeek, { weekStartsOn: 1 }),
    });
  };

  return (
    <div>
      <ButtonGroup isDisabled={isPending} variant="flat">
        <Button isIconOnly onClick={setPreviousWeek}>
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="sr-only">Semaine précédente</span>
        </Button>
        <Divider orientation="vertical" className="h-full bg-red-500" />
        <Button onClick={setNextWeek} isIconOnly>
          <ArrowRightIcon className="h-4 w-4" />
          <span className="sr-only">Semaine suivante</span>
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default WeekNavigation;
