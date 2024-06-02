import { db } from "@/server/db";
// use date-fns for date manipulation
import {
  startOfMonth,
  endOfMonth,
  format,
  endOfYear,
  startOfYear,
  subYears,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { getSummaryData } from "../analytics";

export interface getRevenueByWeekProps {
  month: number;
  year: number;
}

export interface getRevenueByWeekOut {
  data: {
    date: string;
    revenue: number;
  }[];
}

export async function getTotalRevenueByWeek(
  props: getRevenueByWeekProps,
): Promise<getRevenueByWeekOut> {
  const { month, year } = props;
  // get the start and end date of the month
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  // query to get the revenue by week
  const revenueByWeek = await db.payment.findMany({
    where: {
      paymentDate: {
        gte: startDate,
        lte: endDate,
      },
      isPaid: true,
    },
    select: {
      paymentDate: true,
      amount: true,
    },
  });

  // get the weeks in the month
  const weeks = [];
  let weekStart = startDate;
  let weekEnd = startDate;
  while (weekEnd <= endDate) {
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    weeks.push({
      start: weekStart,
      end: weekEnd,
    });
    weekStart = new Date(weekEnd);
  }

  // calculate revenue by week
  const revenueByWeekData = weeks.map((week) => {
    const weekRevenue = revenueByWeek.reduce((acc, payment) => {
      if (
        payment.paymentDate >= week.start &&
        payment.paymentDate <= week.end
      ) {
        return acc + payment.amount;
      }
      return acc;
    }, 0);
    return {
      // date: 01/11 -  07/11
      date: format(week.start, "dd/MM") + " - " + format(week.end, "dd/MM"),
      revenue: weekRevenue,
    };
  });

  return { data: revenueByWeekData };
}

export interface getTotalRevenueByMonthProps {
  year: number;
}

export interface getTotalRevenueByMonthOut {
  data: {
    month: string;
    revenue: number;
  }[];
}

export async function getTotalRevenueByMonth(
  props: getTotalRevenueByMonthProps,
): Promise<getTotalRevenueByMonthOut> {
  const { year } = props;
  // Get the start and end date of the year
  const startDateOfYear = startOfYear(new Date(year, 0));
  const endDateOfYear = endOfYear(new Date(year, 0));

  // Query to get the revenue by month
  const revenueByMonth = await db.payment.findMany({
    where: {
      paymentDate: {
        gte: startDateOfYear,
        lte: endDateOfYear,
      },
      isPaid: true,
    },
    select: {
      paymentDate: true,
      amount: true,
    },
  });

  // Calculate total revenue for each month
  const revenueByMonthData = Array.from({ length: 12 }, (_, index) => {
    const monthStart = new Date(year, index, 1);
    const monthEnd = endOfYear(new Date(year, index, 0));
    const monthRevenue = revenueByMonth.reduce((acc, payment) => {
      if (
        payment.paymentDate >= monthStart &&
        payment.paymentDate <= monthEnd
      ) {
        return acc + payment.amount;
      }
      return acc;
    }, 0);
    return {
      // Format month in "MMM YY" format
      month: format(monthStart, "MMM yy"),
      revenue: monthRevenue,
    };
  });

  return { data: revenueByMonthData };
}

export interface getRevenueComparisonByMonthProps {
  year: number;
}

export interface getRevenueComparisonByMonthOut {
  data: {
    date: string;
    [key: string]: number | string;
  }[];
}

export async function getRevenueComparisonByMonth(
  props: getRevenueComparisonByMonthProps,
): Promise<getRevenueComparisonByMonthOut> {
  const { year } = props;

  // Get the start and end dates of the current year and the previous year
  const startDateOfYear = startOfYear(new Date(year, 0));
  const endDateOfYear = endOfYear(new Date(year, 0));
  const startDateOfLastYear = startOfYear(subYears(new Date(year, 0), 1));
  const endDateOfLastYear = endOfYear(subYears(new Date(year, 0), 1));

  // Query to get the revenue by month for the current year
  const revenueByMonthThisYear = await db.payment.findMany({
    where: {
      paymentDate: {
        gte: startDateOfYear,
        lte: endDateOfYear,
      },
      isPaid: true,
    },
    select: {
      paymentDate: true,
      amount: true,
    },
  });

  // Query to get the revenue by month for the previous year
  const revenueByMonthLastYear = await db.payment.findMany({
    where: {
      paymentDate: {
        gte: startDateOfLastYear,
        lte: endDateOfLastYear,
      },
      isPaid: true,
    },
    select: {
      paymentDate: true,
      amount: true,
    },
  });

  // Combine revenue data for both years
  const revenueData = Array.from({ length: 12 }, (_, index) => {
    const monthStart = new Date(year, index, 1);
    const monthEnd = endOfYear(new Date(year, index, 0));

    // Calculate revenue for the current year
    const monthRevenueThisYear = revenueByMonthThisYear.reduce(
      (acc, payment) => {
        if (
          payment.paymentDate >= monthStart &&
          payment.paymentDate <= monthEnd
        ) {
          return acc + payment.amount;
        }
        return acc;
      },
      0,
    );

    // Get revenue for the same month in the previous year
    const monthRevenueLastYear = revenueByMonthLastYear.reduce(
      (acc, payment) => {
        if (
          payment.paymentDate >= monthStart &&
          payment.paymentDate <= monthEnd
        ) {
          return acc + payment.amount;
        }
        return acc;
      },
      0,
    );

    return {
      date: format(monthStart, "MMM dd"),
      "This Year": monthRevenueThisYear,
      "Last Year": monthRevenueLastYear,
    };
  });

  return { data: revenueData };
}

export const getThisWeeksSummary = async () => {
  const [payments, expenses] = await Promise.all([
    db.payment.findMany({
      where: {
        isPaid: true,
      },
    }),
    db.expense.findMany(),
  ]);

  const start = startOfWeek(new Date().setHours(15), { weekStartsOn: 1 });
  const end = endOfWeek(new Date().setHours(15), { weekStartsOn: 1 });
  const summaryData = getSummaryData(expenses, payments, start, end);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return summaryData;
};

export const getWeekActivity = async (start: Date, end: Date) => {
  const [patients, appointments] = await Promise.all([
    db.patient.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        dateOfBirth: true,
        email: true,
        address: true,
        insuranceProvider: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    }),
    // starttime - endtime
    db.appointment.findMany({
      where: {
        OR: [
          {
            startTime: {
              gte: start,
              lte: end,
            },
          },
          {
            endTime: {
              gte: start,
              lte: end,
            },
          },
        ],
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        notes: true,
        floor: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            phoneNumber: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        therapist: {
          select: {
            id: true,
            name: true,
            image: true,
            speciality: true,
            createdAt: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    }),
  ]);

  return {
    patients: patients.map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      phoneNumber: p.phoneNumber,
      dateOfBirth: p.dateOfBirth,
      email: p.email,
      address: p.address,
      insuranceProvider: p.insuranceProvider,
      notes: p.notes,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      appointmentsCount: p._count.appointments,
    })),
    appointments,
  };
};

/**
 * prisma schema:
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
    id         String   @id @default(cuid())
    name       String
    image      String   @db.Text
    speciality String?
    createdAt  DateTime @default(now()) @map("created_at")
    updatedAt  DateTime @updatedAt @map("updated_at")

    @@map("therapists")
}

model Appointment {
    id          String   @id @default(cuid())
    patientId   Int      @map("patient_id")
    therapistId String   @map("therapist_id")
    serviceId   String?  @map("service_id")
    date        DateTime
    duration    Int // in minutes
    status      String // pending, confirmed, cancelled: when the patient cancels the appointment or the therapist cancels the appointment or the appointment is cancelled by the management
    createdAt   DateTime @default(now()) @map("created_at")
    updatedAt   DateTime @updatedAt @map("updated_at")
    // when the appointment is confirmed, the service is added to the appointment
    service     Service? @relation(fields: [serviceId], references: [id], onDelete: SetNull)
    patient     Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)

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
    patientId        Int      @map("patient_id")
    amount           Float
    description      String?
    label            String
    numberOfSessions Int?     @default(1) @map("number_of_sessions") // if the payment is for multiple sessions
    // add more needed fields
    paymentDate      DateTime @map("payment_date") // the date when the payment was made
    paymentMethod    String?  @map("payment_method") // the method used for the payment (e.g., cash, credit card, bank transfer)
    isPaid           Boolean  @default(false) // indicates if the payment has been fully paid
    // add any other fields that are relevant to your payment system
    notes            String?  @db.Text // additional notes for the payment  (e.g., reason for the payment, special instructions, etc...)

    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")
    patient   Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)

    @@map("payments")
}

enum ExpenseType {
    OPERATIONAL
    SALARY
    RENT
    UTILITIES
    EQUIPMENT
    OTHER
}

model Expense {
    id          String      @id @default(cuid())
    description String?
    amount      Float
    date        DateTime
    type        ExpenseType
    notes       String? // Additional notes or comments about the expense

    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")

    @@map("expenses")
}

 */
