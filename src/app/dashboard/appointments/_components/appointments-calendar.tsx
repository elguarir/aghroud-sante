"use client";

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
} from "date-fns";

import { RouterOutput } from "@/server/api/root";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppointmentForm from "./appointment-form";
import { CalendarHeader, DaysGrid, DaysOfWeek } from "./calendar";
import { actionCopy, useCalendarStore } from "@/hooks/use-calendar-store";
import AppointmentsAgenda from "./appointments-agenda";

const meetings = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2024-05-11T13:00",
    endDatetime: "2024-05-11T14:30",
  },
  {
    id: 2,
    name: "Michael Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2024-05-20T09:00",
    endDatetime: "2024-05-20T11:30",
  },
  {
    id: 3,
    name: "Alex Ferguson",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2024-05-20T09:00",
    endDatetime: "2024-05-20T11:30",
  },
  {
    id: 3,
    name: "Dries Vincent",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-05-20T17:00",
    endDatetime: "2022-05-20T18:30",
  },
  {
    id: 4,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-06-09T13:00",
    endDatetime: "2022-06-09T14:30",
  },
  {
    id: 5,
    name: "Michael Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-05-13T14:00",
    endDatetime: "2022-05-13T14:30",
  },
];

interface Props {
  appointments: RouterOutput["appointment"]["all"];
}

export default function AppointmentsCalendar(props: Props) {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  let days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  let router = useRouter();
  let { isOpen, onOpenChange, action, clearAction } = useCalendarStore();

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  let selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay),
  );

  return (
    <>
      <CalendarHeader
        currentMonth={currentMonth}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
      />
      <div className="custom-scrollbar w-full overflow-x-auto max-2xl:w-[calc(100dvw-385px)] max-xl:w-[calc(100dvw-380px)] max-lg:w-[calc(100dvw-340px)] max-md:w-[calc(100dvw-50px)] max-sm:w-[calc(100dvw-40px)] [@media(min-width:1536px)]:w-[calc(100dvw-380px)]">
        <div className="min-w-[1000px]">
          <DaysOfWeek />
          <DaysGrid
            days={days}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            firstDayCurrentMonth={firstDayCurrentMonth}
            meetings={meetings}
          />
        </div>
      </div>
      {action && (
        <Modal
          shouldBlockScroll
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          backdrop="blur"
          size="lg"
          classNames={{
            base: "md:max-h-[85dvh]",
            wrapper: "overflow-hidden",
          }}
        >
          <ModalContent>
            {() => (
              <div className="custom-scrollbar max-h-[88dvh] overflow-y-auto p-1">
                <div className="rounded-md">
                  <ModalHeader className="flex flex-col gap-1">
                    {actionCopy(action)?.label}
                    <p className="text-sm font-[450] text-default-500">
                      {actionCopy(action)?.description}
                    </p>
                  </ModalHeader>
                  <ModalBody>
                    {action.action === "create" && (
                      <AppointmentForm
                        mode="create"
                        onSuccess={() => {
                          clearAction();
                          router.refresh();
                        }}
                      />
                    )}
                    {action.action === "view" && (
                      <AppointmentsAgenda date={action.date} />
                    )}
                  </ModalBody>
                </div>
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
