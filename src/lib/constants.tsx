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
