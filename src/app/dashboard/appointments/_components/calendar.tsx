"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button, ButtonGroup } from "@nextui-org/button";
import {
  isSameDay,
  isSameMonth,
  isEqual,
  isToday,
  isSunday,
  getDay,
  format,
  parse,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CalendarPlusIcon, ClockFadingIcon } from "@/components/icons";
import { useCalendarStore } from "@/hooks/use-calendar-store";
import { fr } from "date-fns/locale";
import { RouterOutput } from "@/server/api/root";
import { AppointmentStatus } from "./appointments-data";

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

interface CalendarHeaderProps {
  currentMonth: string;
  previousMonth: () => void;
  nextMonth: () => void;
}

function CalendarHeader({
  currentMonth,
  previousMonth,
  nextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex h-full items-center gap-2">
      <h2 className="flex-auto font-semibold capitalize text-neutral-900 dark:text-neutral-100">
        {format(parse(currentMonth, "MMM-yyyy", new Date()), "MMMM yyyy", {
          locale: fr,
        })}
      </h2>
      <div className="flex items-center">
        <ButtonGroup variant="bordered">
          <Button type="button" onClick={previousMonth} isIconOnly>
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon
              className="h-5 w-5 text-default-600"
              aria-hidden="true"
            />
          </Button>
          <Button type="button" onClick={nextMonth} isIconOnly>
            <span className="sr-only">Next month</span>
            <ChevronRightIcon
              className="h-5 w-5 text-default-600"
              aria-hidden="true"
            />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

function DaysOfWeek() {
  let daysOfWeek = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  return (
    <div className="mt-10 grid grid-cols-7 divide-x divide-default-300/40 rounded-md border-2 border-dashed border-default-300/40 bg-default-100/50 text-center text-xs leading-6 text-default-500">
      {daysOfWeek.map((day) => (
        <div key={day} className="p-4">
          {day}
        </div>
      ))}
    </div>
  );
}

interface DaysGridProps {
  days: Date[];
  selectedDay: Date;
  setSelectedDay: (day: Date) => void;
  firstDayCurrentMonth: Date;
  appointments: RouterOutput["appointment"]["all"];
}
function DaysGrid({
  days,
  selectedDay,
  setSelectedDay,
  firstDayCurrentMonth,
  appointments,
}: DaysGridProps) {
  return (
    <div className="mt-2 grid grid-cols-7 divide-x-[0.114em] divide-y-[0.114em] overflow-hidden rounded-lg border-2 border-dashed border-default-300/40 text-[10px] font-[450]">
      {days.map((day, dayIdx) => {
        let thisDayAppointments = appointments.filter((appointment) =>
          isSameDay(appointment.startTime, day),
        );
        return (
          <DayCell
            key={day.toString()}
            day={day}
            dayIdx={dayIdx}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            firstDayCurrentMonth={firstDayCurrentMonth}
            thisDayAppointments={thisDayAppointments}
          />
        );
      })}
    </div>
  );
}
interface DayCellProps {
  day: Date;
  dayIdx: number;
  selectedDay: Date;
  setSelectedDay: (day: Date) => void;
  firstDayCurrentMonth: Date;
  thisDayAppointments: RouterOutput["appointment"]["all"];
}
function DayCell({
  day,
  dayIdx,
  selectedDay,
  setSelectedDay,
  firstDayCurrentMonth,
  thisDayAppointments,
}: DayCellProps) {
  const [appointmentToShow, setAppointmentToShow] = useState<
    RouterOutput["appointment"]["all"][number] | undefined
  >(thisDayAppointments[0]);
  const setCalendarAction = useCalendarStore(
    (state) => state.setCalendarAction,
  );
  const showNextButton =
    thisDayAppointments.length > 1 &&
    appointmentToShow !== thisDayAppointments[0];
  const showPreviousButton =
    thisDayAppointments.length > 1 &&
    appointmentToShow !== thisDayAppointments[thisDayAppointments.length - 1];

  const handleNextAppointment = () => {
    let nextAppointmentIdx = thisDayAppointments.findIndex(
      (appointment) => appointment.id === appointmentToShow?.id,
    );
    nextAppointmentIdx = (nextAppointmentIdx + 1) % thisDayAppointments.length;
    setAppointmentToShow(thisDayAppointments[nextAppointmentIdx]);
  };

  const handlePreviousAppointment = () => {
    let previousAppointmentIdx = thisDayAppointments.findIndex(
      (appointment) => appointment.id === appointmentToShow?.id,
    );
    previousAppointmentIdx =
      (previousAppointmentIdx - 1 + thisDayAppointments.length) %
      thisDayAppointments.length;
    setAppointmentToShow(thisDayAppointments[previousAppointmentIdx]);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "flex h-32 w-full flex-col justify-start gap-y-2 border-default-300/40 bg-default-100/50 p-1.5 hover:bg-default-100/80",
            isSunday(day) && "!border-l-0",
            dayIdx <= 6 && "!border-t-0",
            dayIdx === 0 && colStartClasses[getDay(day)],
          )}
        >
          <button
            type="button"
            onClick={() => setSelectedDay(day)}
            className={cn(
              isEqual(day, selectedDay) && "text-white",
              !isEqual(day, selectedDay) && isToday(day) && "text-primary-500",
              !isEqual(day, selectedDay) &&
                !isToday(day) &&
                isSameMonth(day, firstDayCurrentMonth) &&
                "text-neutral-900 dark:text-neutral-100",
              !isEqual(day, selectedDay) &&
                !isToday(day) &&
                !isSameMonth(day, firstDayCurrentMonth) &&
                "text-neutral-400 dark:text-neutral-500",
              isEqual(day, selectedDay) && isToday(day) && "bg-primary-500",
              isEqual(day, selectedDay) &&
                !isToday(day) &&
                "bg-neutral-900 dark:bg-neutral-700",
              !isEqual(day, selectedDay) &&
                "hover:bg-neutral-200 dark:hover:bg-neutral-600",
              (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
              "flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-250",
            )}
          >
            <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
          </button>
          {appointmentToShow && (
            <>
              <div className="flex w-full flex-1 flex-col">
                <div className="flex w-full items-center justify-end pr-1">
                  <button
                    type="button"
                    disabled={!showNextButton}
                    onClick={handleNextAppointment}
                  >
                    <span className="sr-only">Next appointment</span>
                    <ChevronUpIcon
                      className={`h-3 w-3 ${!showNextButton ? "text-default-600 opacity-50" : "text-primary-500"}`}
                    />
                  </button>
                </div>
                <AppointmentPreview
                  key={appointmentToShow.id}
                  appointment={appointmentToShow}
                />
                <div className="flex w-full items-center justify-end pr-1">
                  <button
                    type="button"
                    disabled={!showPreviousButton}
                    onClick={handlePreviousAppointment}
                  >
                    <span className="sr-only">Previous appointment</span>
                    <ChevronDownIcon
                      className={`h-3 w-3 ${!showPreviousButton ? "text-default-600 opacity-50" : "text-primary-500"}`}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[150px]">
        <ContextMenuItem
          onClick={() => {
            setCalendarAction({
              action: "view",
              date: new Date(day.setHours(15)),
            });
          }}
        >
          <div className="flex items-center gap-2">
            <ClockFadingIcon className="h-4 w-4" />
            Voir l'agenda
          </div>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setCalendarAction({
              action: "create",
              date: new Date(day.setHours(15)),
            });
          }}
        >
          <div className="flex items-center gap-2">
            <CalendarPlusIcon className="h-4 w-4" />
            Rendez-vous
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function AppointmentPreview({
  appointment,
}: {
  appointment: RouterOutput["appointment"]["all"][number];
}) {
  let status = AppointmentStatus.find((st) => st.value === appointment.status);
  let color = `bg-${status?.color}`;
  return (
    <div className="flex items-center space-x-2 rounded-md border border-default-foreground/5 bg-default-100 p-1 py-1.5">
      <div className={cn("h-full w-[3.5px] rounded-medium", color)} />
      <div className="flex-auto">
        <p className="max-w-full truncate text-default-700">
          {appointment.patient.firstName} {appointment.patient.lastName}
        </p>
        <p className="mt-0.5">
          <time dateTime={appointment.startTime.toTimeString()}>
            {format(appointment.startTime, "HH:mm")}
          </time>{" "}
          -{" "}
          <time dateTime={appointment.endTime.toTimeString()}>
            {format(appointment.endTime, "HH:mm")}
          </time>
        </p>
      </div>
    </div>
  );
}

export { CalendarHeader, DaysOfWeek, DaysGrid, AppointmentPreview };
