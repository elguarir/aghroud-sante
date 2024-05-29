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


interface Props {
  appointments: RouterOutput["appointment"]["all"];
}

export default function AppointmentsCalendar(props: Props) {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  console.log('appointments', props.appointments)
  let days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  let router = useRouter();
  let { isOpen, onOpenChange, action, clearAction, setCalendarAction } =
    useCalendarStore();

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

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
            appointments={props.appointments}
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
          onClose={() => {
            router.refresh();
            clearAction();
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
                          router.refresh();
                          clearAction();
                        }}
                      />
                    )}
                    {action.action === "update" && (
                      <AppointmentForm
                        mode="edit"
                        appointmentId={action.appointment.id}
                        onCancel={() =>
                          setCalendarAction({
                            action: "view",
                            date: action.appointment.date,
                          })
                        }
                        onSuccess={() => {
                          setCalendarAction({
                            action: "view",
                            date: action.appointment.date,
                          });
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
