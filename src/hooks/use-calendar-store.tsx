import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { create } from "zustand";

interface CalendarActionCreate {
  action: "create";
  date: Date;
}
interface CalendarActionUpdate {
  action: "update";
  appointment: {
    id: string;
    date: Date;
  };
}
interface CalendarActionDelete {
  action: "delete";
  appointment: {
    id: string;
    date: Date;
  };
}
interface CalendarActionView {
  action: "view";
  date: Date;
}

export type CalendarAction =
  | CalendarActionCreate
  | CalendarActionUpdate
  | CalendarActionDelete
  | CalendarActionView;

interface Calendar {
  isOpen: boolean;
  action: CalendarAction | null;
  setCalendarAction: (action: CalendarAction) => void;
  onClose: () => void;
  onOpenChange: (state: boolean) => void;
  clearAction: () => void;
}

export const useCalendarStore = create<Calendar>((set) => ({
  isOpen: false,
  action: null,
  onOpenChange: (state: boolean) => set({ isOpen: state }),
  onClose: () => set({ isOpen: false }),
  setCalendarAction: (action) => {
    set({ isOpen: true });
    set({ action });
  },
  clearAction: () => {
    set({ isOpen: false });
    set({ action: null });
  },
}));

export const actionCopy = (action: CalendarAction) => {
  switch (action.action) {
    case "create":
      return {
        label: "Ajouter un rendez-vous",
        description:
          "Ajouter un nouveau rendez-vous au système en remplissant le formulaire.",
      };
    case "view":
      return {
        label: "Agenda du jour",
        description: (
          <>
            Voici les rendez-vous du{" "}
            <span className="font-semibold">
              {format(action.date, "dd MMMM yyyy", {
                locale: fr,
              })}
            </span>
          </>
        ),
      };

    case "update":
      return {
        label: "Modifier un rendez-vous",
        description:
          "Modifier un rendez-vous existant en remplissant le formulaire.",
      };
  }
};
