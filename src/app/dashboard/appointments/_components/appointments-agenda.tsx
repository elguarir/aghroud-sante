import { AppointmentStatus } from "@/lib/schemas/new-appointment";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/trpc/react";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useCalendarStore } from "@/hooks/use-calendar-store";
import * as Accordion from "@radix-ui/react-accordion";
import { Chip } from "@nextui-org/chip";
import { Avatar } from "@nextui-org/avatar";
import { EditIcon } from "@/components/icons";
import { Tooltip } from "@nextui-org/tooltip";

interface Props {
  date: Date;
}

const AppointmentsAgenda = (props: Props) => {
  const { data: appointments, isLoading } =
    api.appointment.allWithFilter.useQuery({ date: props.date });
  const setCalendarAction = useCalendarStore(
    (state) => state.setCalendarAction,
  );

  if (isLoading) {
    return (
      <div className="flex h-52 w-full flex-col items-center justify-center pb-3 pt-8">
        <Spinner size="md" color="current" />
      </div>
    );
  }
  return (
    <div className="mb-2">
      <Accordion.Root
        className="flex w-full flex-col divide-y divide-default-200"
        type="single"
        collapsible
      >
        {appointments?.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </Accordion.Root>

      {appointments?.length === 0 && (
        <div className="space-y-3">
          <div className="flex h-28 w-full items-center justify-center">
            <span className="text-default-500">Aucun rendez-vous</span>
          </div>
          <div className="flex w-full justify-end">
            <Button
              color="primary"
              onClick={() => {
                setCalendarAction({
                  action: "create",
                  date: props.date,
                });
              }}
            >
              Ajouter un rendez-vous
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsAgenda;

const AppointmentCard = ({
  appointment,
}: {
  appointment: RouterOutput["appointment"]["allWithFilter"][0];
}) => {
  const setCalendarAction = useCalendarStore(
    (state) => state.setCalendarAction,
  );

  const status = AppointmentStatus.find(
    (status) => status.value === appointment.status,
  );

  let color = `bg-${status?.color}`;

  return (
    <Accordion.Item
      value={appointment.id}
      className="flex w-full flex-col gap-2 py-4"
    >
      <Accordion.Header>
        <Accordion.Trigger className="group flex h-fit w-full items-center gap-2 text-default-700">
          <div className={`h-16 w-[3px] rounded-full ${color}`} />
          <div className="flex h-full flex-1 flex-col justify-start rounded-small p-2 transition-colors hover:bg-default-100">
            <div className="flex w-full items-center text-small font-medium text-default-500">
              <span>{format(new Date(appointment.startTime), "HH:mm")}</span>
              <ArrowRightIcon className="mx-1 h-4 w-4" />
              <span>{format(new Date(appointment.endTime), "HH:mm")}</span>
            </div>
            <div className="flex w-full items-center">
              <div className="line-clamp-1 w-full text-left font-semibold">
                {appointment.patient?.firstName} {appointment.patient?.lastName}
              </div>
            </div>
            <div className="mt-auto flex justify-end">
              <button className="rounded-sm text-tiny font-medium  text-primary underline focus-visible:outline-none">
                <span className="transition duration-250 group-data-[state=closed]:block group-data-[state=open]:hidden">
                  Détails
                </span>
                <span className="transition duration-250 group-data-[state=open]:block group-data-[state=closed]:hidden">
                  Masquer
                </span>
              </button>
            </div>
          </div>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="ml-3 h-fit rounded-medium border border-default-200 px-2 py-1.5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        {/* show all the other info about the appointment */}
        <ul className="relative flex flex-col divide-y divide-default-200">
          <li className="flex items-center gap-2.5 py-2">
            <span className="text-default-500">Thérapeute:</span>
            <div className="flex items-center gap-2 text-default-700">
              <Avatar
                src={appointment.therapist?.image}
                alt={appointment.therapist?.name}
                size="sm"
                isBordered
                className="ring-offset-1"
                radius="full"
              />
              {appointment.therapist?.name || "Non défini"}
            </div>
          </li>
          <li className="flex items-center gap-2.5 py-2">
            <span className="text-default-500">Service:</span>
            <span className="text-default-700">
              {appointment.service?.name || "Non défini"}
            </span>
          </li>
          <li className="flex items-center gap-2.5 py-2">
            <span className="text-default-500">Statut:</span>
            <Chip
              color={status?.color}
              className="text-tiny font-medium"
              size="sm"
              variant="flat"
            >
              {status?.label}
            </Chip>
          </li>
          <li className="flex items-start gap-2.5 py-2">
            <span className="text-default-500">Notes:</span>
            <span className="text-default-700">
              {appointment.notes || "Non défini"}
            </span>
          </li>
          <div className="absolute -right-1.5 -top-1 !border-t-0">
            <Tooltip
              content="Modifier le rendez-vous"
              placement="top"
              delay={150}
              closeDelay={100}
            >
              <Button
                onClick={() => {
                  setCalendarAction({
                    action: "update",
                    appointment: {
                      id: appointment.id,
                      date: new Date(appointment.startTime),
                    },
                  });
                }}
                isIconOnly
                size="sm"
                radius="full"
                variant="light"
              >
                <EditIcon className="h-4 w-4 text-default-500" />
              </Button>
            </Tooltip>
          </div>
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  );
};

/**
 * 
 * prsima schema : 
 * //currently building an internal management software for a kinesitherapy center, the requirements needed are to keep track of appointments, patients, also services they needed on each session, keeping track of payments, also keeping track of expenses and revenue on each week. also providing some monthly reports etc...
//i'using react, nextjs,prisma,postgresql, first let's talk about non technical requirements. the problem and the flow needed if you need any information feel free to ask

generator client {
    provider = "prisma-client-js"
}

datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

// this model is for management personnels
model User {
    id          String   @id @default(cuid())
    name        String
    email       String   @unique
    image       String   @db.Text
    password    String
    phoneNumber String?  @unique @map("phone_number")
    createdAt   DateTime @default(now()) @map("created_at")
    updatedAt   DateTime @updatedAt @map("updated_at")

    @@map("utilisateurs")
}

// this model is for patients
model Patient {
    id                Int           @id @default(autoincrement())
    firstName         String        @map("first_name")
    lastName          String        @map("last_name")
    email             String?
    dateOfBirth       DateTime?     @map("date_of_birth")
    phoneNumber       String?       @map("phone_number")
    address           String?       @db.Text
    notes             String?       @db.Text
    // medical history: it means the patient's medical history which includes the patient's past and present health issues, surgeries, medications, allergies, and other medical conditions.
    insuranceProvider String?
    createdAt         DateTime      @default(now()) @map("created_at")
    updatedAt         DateTime      @updatedAt @map("updated_at")
    appointments      Appointment[]
    documents         Document[]
    payments          Payment[]

    @@map("patients")
}

model Therapist {
    id           String        @id @default(cuid())
    name         String
    image        String        @db.Text
    speciality   String?
    createdAt    DateTime      @default(now()) @map("created_at")
    updatedAt    DateTime      @updatedAt @map("updated_at")
    appointments Appointment[]

    @@map("therapists")
}

enum AppointmentStatus {
    PENDING
    CONFIRMED
    CANCELLED
}

model Appointment {
    id          String            @id @default(cuid())
    patientId   Int               @map("patient_id")
    therapistId String?           @map("therapist_id")
    serviceId   String?           @map("service_id")
    startTime   DateTime          @map("start_time") @db.Timestamptz()
    endTime     DateTime          @map("end_time") @db.Timestamptz()
    floor       Int?
    notes       String?           @db.Text
    // etage       Int?
    status      AppointmentStatus // pending, confirmed, cancelled: when the patient cancels the appointment or the therapist cancels the appointment or the appointment is cancelled by the management
    createdAt   DateTime          @default(now()) @map("created_at")
    updatedAt   DateTime          @updatedAt @map("updated_at")
    // when the appointment is confirmed, the service is added to the appointment
    service     Service?          @relation(fields: [serviceId], references: [id], onDelete: SetNull)
    patient     Patient           @relation(fields: [patientId], references: [id], onDelete: Cascade)
    therapist   Therapist?        @relation(fields: [therapistId], references: [id], onDelete: SetNull)

    @@map("appointments")
}

model Service {
    id           String        @id @default(cuid())
    name         String
    description  String?
    price        Float?
    duration     Int? // in minutes
    createdAt    DateTime      @default(now()) @map("created_at")
    updatedAt    DateTime      @updatedAt @map("updated_at")
    appointments Appointment[]

    @@map("services")
}

model Document {
    id          String @id @default(cuid())
    patientId   Int    @map("patient_id")
    name        String
    contentType String @map("content_type")
    fileSize    Int    @map("file_size")
    key         String

    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")
    patient   Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)

    @@map("documents")
}

// Payments model: for this model, we need to keep track of the payments made by the patients, the payments made might not exactly be related to an appointment, it could be for a service or a product, or multiple sessions or paid in advance.
// we also need an enum for the payment label which could be "appointment", "service", "product", "advance", etc...

model Payment {
    id               String   @id @default(cuid())
    patientId        Int?     @map("patient_id")
    label            String?
    amount           Float
    numberOfSessions Int?     @default(1) @map("number_of_sessions") // if the payment is for multiple sessions
    // the date when the payment was made
    paymentDate      DateTime @map("payment_date")
    // the method used for the payment (e.g., cash, credit card, bank transfer)
    paymentMethod    String?  @map("payment_method")

    isPaid Boolean @default(false) @map("is_paid") // indicates if the payment has been fully paid
    // add any other fields that are relevant to your payment system
    notes  String? @db.Text // additional notes for the payment  (e.g., reason for the payment, special instructions, etc...)

    patient Patient? @relation(fields: [patientId], references: [id], onDelete: Cascade)

    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")

    @@map("payments")
}

// Expenses model: for this model, we need to keep track of the expenses incurred by the center. The expenses could be related to operational costs, salaries, equipment, utilities, rent, or other expenses.

enum ExpenseType {
    OPERATIONAL
    SALARY
    EQUIPMENT
    UTILITIES
    RENT
    OTHER
}

model Expense {
    id          String      @id @default(cuid())
    label       String?
    amount      Float
    expenseDate DateTime
    type        ExpenseType
    notes       String? // Additional notes or comments about the expense

    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")

    @@map("expenses")
}

 */
