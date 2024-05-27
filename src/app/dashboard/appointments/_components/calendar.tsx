"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button, ButtonGroup } from "@nextui-org/button";
import {
  parseISO,
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
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  CalendarPlusIcon,
  ClockFadingIcon,
  GridViewIcon,
  ListViewIcon,
} from "@/components/icons";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useCalendarStore } from "@/hooks/use-calendar-store";
import { fr } from "date-fns/locale";

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
      <h2 className="flex-auto capitalize font-semibold text-neutral-900 dark:text-neutral-100">
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
  meetings: Meeting[];
}
function DaysGrid({
  days,
  selectedDay,
  setSelectedDay,
  firstDayCurrentMonth,
  meetings,
}: DaysGridProps) {
  return (
    <div className="mt-2 grid grid-cols-7 divide-x-[0.114em] divide-y-[0.114em] overflow-hidden rounded-lg border-2 border-dashed border-default-300/40 text-[10px] font-[450]">
      {days.map((day, dayIdx) => {
        let thisDayMeetings = meetings.filter((meeting) =>
          isSameDay(parseISO(meeting.startDatetime), day),
        );
        return (
          <DayCell
            key={day.toString()}
            day={day}
            dayIdx={dayIdx}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            firstDayCurrentMonth={firstDayCurrentMonth}
            meetings={thisDayMeetings}
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
  meetings: Meeting[];
}
function DayCell({
  day,
  dayIdx,
  selectedDay,
  setSelectedDay,
  firstDayCurrentMonth,
  meetings,
}: DayCellProps) {
  const [mettingToShow, setMeetingToShow] = useState<Meeting | undefined>(
    meetings[0],
  );
  const setCalendarAction = useCalendarStore(
    (state) => state.setCalendarAction,
  );
  const showNextButton = meetings.length > 1 && mettingToShow !== meetings[0];
  const showPreviousButton =
    meetings.length > 1 && mettingToShow !== meetings[meetings.length - 1];

  const handleNextMeeting = () => {
    let nextMeetingIdx = meetings.findIndex(
      (meeting) => meeting.id === mettingToShow?.id,
    );
    nextMeetingIdx = (nextMeetingIdx + 1) % meetings.length;
    setMeetingToShow(meetings[nextMeetingIdx]);
  };

  const handlePreviousMeeting = () => {
    let previousMeetingIdx = meetings.findIndex(
      (meeting) => meeting.id === mettingToShow?.id,
    );
    previousMeetingIdx =
      (previousMeetingIdx - 1 + meetings.length) % meetings.length;
    setMeetingToShow(meetings[previousMeetingIdx]);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "flex h-32 w-full flex-col justify-start gap-y-2 border-default-300/40 bg-default-100/50 p-1.5 hover:bg-default-100/80 peer-has-[hover=true]:bg-red-500",
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
          {mettingToShow && (
            <>
              <div className="flex w-full flex-1 flex-col">
                <div className="flex w-full items-center justify-end pr-1">
                  <button
                    type="button"
                    disabled={!showNextButton}
                    onClick={handleNextMeeting}
                  >
                    <span className="sr-only">Next meeting</span>
                    <ChevronUpIcon
                      className={`h-3 w-3 ${!showNextButton ? "text-default-600 opacity-50" : "text-primary-500"}`}
                    />
                  </button>
                </div>
                <MeetingPreview
                  key={mettingToShow.id}
                  meeting={mettingToShow}
                />
                <div className="flex w-full items-center justify-end pr-1">
                  <button
                    type="button"
                    disabled={!showPreviousButton}
                    onClick={handlePreviousMeeting}
                  >
                    <span className="sr-only">Previous meeting</span>
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
            setCalendarAction({ action: "view", date: day });
          }}
        >
          <div className="flex items-center gap-2">
            <ClockFadingIcon className="h-4 w-4" />
            Voir l'agenda
          </div>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setCalendarAction({ action: "create", date: day });
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

function MeetingPreview({ meeting }: MeetingProps) {
  return (
    <div className="peer flex items-center space-x-2 rounded-md border border-default-foreground/5 bg-default-100 p-1.5">
      <div className="flex-auto">
        <p className="max-w-full truncate text-default-700">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(parseISO(meeting.startDatetime), "h:mm a")}
          </time>{" "}
          -{" "}
          <time dateTime={meeting.endDatetime}>
            {format(parseISO(meeting.endDatetime), "h:mm a")}
          </time>
        </p>
      </div>
      <div className="flex h-full items-center">
        <button>
          <DotsVerticalIcon className="h-3.5 w-3.5 text-default-600" />
        </button>
      </div>
    </div>
  );
}

export interface Meeting {
  id: number;
  name: string;
  imageUrl: string;
  startDatetime: string;
  endDatetime: string;
}

interface MeetingProps {
  meeting: Meeting;
}
function Meeting({ meeting }: MeetingProps) {
  let startDateTime = parseISO(meeting.startDatetime);
  let endDateTime = parseISO(meeting.endDatetime);

  return (
    <li className="group flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-neutral-100 hover:bg-neutral-100 dark:focus-within:bg-neutral-800 dark:hover:bg-neutral-800">
      <img
        src={meeting.imageUrl}
        alt=""
        className="h-10 w-10 flex-none rounded-full"
      />
      <div className="flex-auto">
        <p className="text-neutral-900 dark:text-neutral-100">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, "h:mm a")}
          </time>{" "}
          -{" "}
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, "h:mm a")}
          </time>
        </p>
      </div>
    </li>
  );
}

export { CalendarHeader, DaysOfWeek, DaysGrid, MeetingPreview, Meeting };
