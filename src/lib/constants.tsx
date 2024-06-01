import { SideBarItemProps } from "@/app/dashboard/_components/sidebar-item";
import {
  CalendarIcon,
  DashboardIcon,
  InvoicesIcon,
  MoneyInIcon,
  MoneyOutIcon,
  PatientsIcon,
  ReportsIcon,
  ServicesIcon,
  SettingsIcon,
} from "@/components/icons";
import { endOfMonth, subMonths, startOfMonth } from "date-fns";

export const links = [
  {
    title: "Dashboard",
    href: "/dashboard",
    type: "normal",
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  {
    title: "Rendez-vous",
    href: "/dashboard/appointments",
    type: "normal",
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    type: "normal",
    icon: <PatientsIcon className="h-5 w-5" />,
  },
  {
    title: "Services",
    href: "/dashboard/services",
    type: "normal",
    icon: <ServicesIcon className="h-5 w-5" />,
  },
  {
    title: "Finance",
    type: "accordion",
    icon: <InvoicesIcon className="h-5 w-5" />,
    items: [
      {
        title: "Revenue",
        href: "/dashboard/revenue",
        type: "normal",
        icon: <MoneyInIcon className="h-5 w-5" />,
      },
      {
        title: "Dépenses",
        href: "/dashboard/expenses",
        type: "normal",
        icon: <MoneyOutIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Rapports",
    href: "/dashboard/reports",
    type: "normal",
    icon: <ReportsIcon className="h-5 w-5" />,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    type: "normal",
    icon: <SettingsIcon className="h-5 w-5" />,
  },
] as SideBarItemProps[];

export const colorValues = [
  // "slate",
  // "gray",
  // "zinc",
  // "neutral",
  // "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

interface DateRange {
  from: Date;
  to: Date;
}

export const getLastMonthsRange = (numberOfMonths: number): DateRange => {
  const today = new Date();

  const to = endOfMonth(today);
  const from = startOfMonth(subMonths(today, numberOfMonths - 1));

  return { from, to };
};

export const presets = [
  {
    label: "Ce mois",
    dateRange: {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
  },
  {
    label: "Le mois dernier",
    dateRange: {
      from: startOfMonth(new Date().setDate(0)),
      to: endOfMonth(new Date().setDate(0)),
    },
  },
  {
    label: "3 derniers mois",
    dateRange: {
      ...getLastMonthsRange(3),
    },
  },
  {
    label: "6 derniers mois",
    dateRange: {
      ...getLastMonthsRange(6),
    },
  },
  {
    label: "Cette année",
    dateRange: {
      from: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
      to: new Date(),
    },
  },
  {
    label: "L'année dernière",
    dateRange: {
      from: new Date(
        new Date().setFullYear(new Date().getFullYear() - 1, 0, 1),
      ),
      to: new Date(
        new Date().setFullYear(new Date().getFullYear() - 1, 11, 31),
      ),
    },
  },
];
