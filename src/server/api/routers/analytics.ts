import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  Day,
  Locale,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Expense, ExpenseType, Payment } from "@prisma/client";
import { capitalize } from "@/lib/utils";
import { ExpenseTypes } from "@/app/dashboard/expenses/_components/expense-data";
import { db } from "@/server/db";

type FinanceReport = {
  date: string;
  Dépenses: number;
  Revenu: number;
  records?: {
    expenses: Expense[];
    payments: Payment[];
  };
};

export const analyticsRouter = createTRPCRouter({
  getRevenueByRange: publicProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { from, to } = input;
      const payments = await ctx.db.payment.findMany({
        where: {
          isPaid: true,
        },
      });

      const expenses = await ctx.db.expense.findMany();

      if (from && to) {
        const groupedExpenses = getGroupedExpensesForRange(
          expenses,
          startOfDay(from),
          endOfDay(to),
        );

        const summaryData = await getSummaryData(
          expenses,
          payments,
          startOfDay(from),
          to,
        );

        return {
          financeData: getDataForRange({
            from: startOfDay(from),
            to: endOfDay(to),
            records: { payments, expenses },
          }),
          groupedExpenses,
          summaryData,
        };
      } else {
        const oldestPayment = payments.reduce((acc, curr) => {
          return acc.paymentDate < curr.paymentDate ? acc : curr;
        });
        const oldestExpense = expenses.reduce((acc, curr) => {
          return acc.expenseDate < curr.expenseDate ? acc : curr;
        });

        const oldestDate =
          oldestPayment.paymentDate < oldestExpense.expenseDate
            ? oldestPayment.paymentDate
            : oldestExpense.expenseDate;

        console.log("oldestDate", oldestDate, "new Date()", new Date());

        const groupedExpenses = getGroupedExpensesForRange(
          expenses,
          startOfDay(oldestDate),
          endOfDay(new Date()),
        );

        const summaryData = await getSummaryData(
          expenses,
          payments,
          startOfDay(oldestDate),
          endOfDay(new Date()),
        );
        const financeData = getDataForRange({
          from: startOfDay(oldestDate),
          to: endOfDay(new Date()),
          records: { payments, expenses },
        });

        return {
          financeData,
          groupedExpenses,
          summaryData: {
            current: summaryData.current,
            previous: summaryData.current,
            percentageChange: {
              totalExpenses: 0,
              totalRevenue: 0,
              netIncome: 0,
              totalPatients: 0,
              totalConfirmedAppointments: 0,
            },
          },
        };
      }
    }),
});

/*****
 *  Helper functions
 *  - findFinanceData: returns the finance data for a specific date, takes an array of expenses, payments, and a date, and returns the total expenses, total revenue, and the records for that date
 *  - getDaysInRange: returns an array of dates between two dates
 *  - getWeeksInRange: returns an array of weeks between two dates, each week is an object with start and end dates
 *  - isDateInRange: checks if a date is within a range
 *  - isOneMonth: checks if the difference between two dates is less than or equal to 31 days
 *  - isOneYearOrMore: checks if the difference between two dates is one year or more
 *  - getMonthsInRange: returns an array of months between two dates, each month is an object with start and end dates
 * - getDataForRange: returns the finance data for a given range of dates, it uses the helper functions to get the data by days, weeks, or months based on the range

*/

interface getDataForRangeProps {
  from: Date;
  to: Date;
  records: {
    payments: Payment[];
    expenses: Expense[];
  };
}

export const getDataForRange = ({
  from,
  to,
  records,
}: getDataForRangeProps) => {
  const { expenses, payments } = records;
  console.log(
    "from",
    from,
    "to",
    to,
    "months",
    isHowManyMonthsBetween(from, to),
  );
  // if the difference between the two dates is less than or equal to 31 days
  if (Math.floor(isHowManyMonthsBetween(from, to)) <= 1) {
    const data: FinanceReport[] = [];

    const days = getDaysInRange(from, to);
    for (const day of days) {
      data.push(findFinanceData(expenses, payments, day));
    }

    return data;
  }
  // if the difference between the two dates is less than or equal to 8 months
  if (Math.floor(isHowManyMonthsBetween(from, to)) <= 8) {
    // get data by weeks
    const data: FinanceReport[] = [];
    const weeks = getWeeksInRange(from, to);
    for (const week of weeks) {
      const weekStart = new Date(week.start);
      const weekEnd = new Date(week.end);
      const days = getDaysInRange(weekStart, weekEnd);
      let weekTotalExpenses = 0;
      let weekTotalRevenue = 0;
      let records: FinanceReport["records"] = {
        expenses: [],
        payments: [],
      };
      for (const day of days) {
        weekTotalExpenses += findFinanceData(expenses, payments, day).Dépenses;
        weekTotalRevenue += findFinanceData(expenses, payments, day).Revenu;
        const thisDayRecords = findFinanceData(expenses, payments, day).records;
        if (thisDayRecords && thisDayRecords?.expenses.length > 0) {
          records.expenses.push(...thisDayRecords.expenses);
        }
        if (thisDayRecords && thisDayRecords?.payments.length > 0) {
          records.payments.push(...thisDayRecords.payments);
        }
      }
      data.push({
        date: `${format(weekStart, "dd, MMM yy", { locale: fr, weekStartsOn: 1 })} - ${format(weekEnd, "dd, MMM yy", { locale: fr, weekStartsOn: 1 })}`,
        Dépenses: weekTotalExpenses,
        Revenu: weekTotalRevenue,
        records,
      });
    }
    return data;
  }

  // if the difference between the two dates is one year or more
  if (Math.floor(isHowManyMonthsBetween(from, to)) >= 8) {
    const data: FinanceReport[] = [];
    const months = getMonthsInRange(from, to);
    for (const month of months) {
      const monthStart = new Date(month.start);
      const monthEnd = new Date(month.end);
      const days = getDaysInRange(monthStart, monthEnd);
      let monthTotalExpenses = 0;
      let monthTotalRevenue = 0;
      for (const day of days) {
        monthTotalExpenses += findFinanceData(expenses, payments, day).Dépenses;
        monthTotalRevenue += findFinanceData(expenses, payments, day).Revenu;
      }
      data.push({
        date: capitalize(`${format(monthStart, "MMM yyyy", { locale: fr })}`),
        Dépenses: monthTotalExpenses,
        Revenu: monthTotalRevenue,
        records: {
          expenses: expenses.filter((expense) =>
            isDateInRange(expense.expenseDate, monthStart, monthEnd),
          ),
          payments: payments.filter((payment) =>
            isDateInRange(payment.paymentDate, monthStart, monthEnd),
          ),
        },
      });
    }
    console.log("data", data, "length", data.length);
    return data;
  }
};

export const isDateInRange = (date: Date, from: Date, to: Date) => {
  return date >= from && date <= to;
};

export const findFinanceData = (
  expenses: Expense[],
  payments: Payment[],
  date: Date,
) => {
  const res: FinanceReport = {
    date: format(date, "dd-MM-yyyy", { locale: fr }),
    Dépenses: 0,
    Revenu: 0,
    records: {
      expenses: [],
      payments: [],
    },
  };

  const expenseTotal = expenses
    .filter((expense) => isSameDay(expense.expenseDate, date))
    .reduce((acc, curr) => {
      res.records?.expenses.push(curr);
      return acc + curr.amount;
    }, 0);

  const paymentTotal = payments
    .filter((payment) => isSameDay(payment.paymentDate, date))
    .reduce((acc, curr) => {
      res.records?.payments.push(curr);
      return acc + curr.amount;
    }, 0);

  res.Dépenses = expenseTotal;
  res.Revenu = paymentTotal;

  return res;
};

export const getDaysInRange = (from: Date, to: Date) => {
  const days: Date[] = [];
  let current = from;

  while (current <= to) {
    days.push(current);
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000); // Move to next day
  }

  return days;
};

export const getWeeksInRange = (
  from: Date,
  to: Date,
  options: { weekStartsOn?: Day; locale?: Locale } = {},
) => {
  const { weekStartsOn = 1, locale = fr } = options;

  const weeks: { start: Date; end: Date }[] = [];
  let current = startOfWeek(from, { weekStartsOn: weekStartsOn });

  while (current <= to) {
    const weekEnd = endOfWeek(current, { weekStartsOn: weekStartsOn });
    const week = weeks[weeks.length - 1];

    if (
      weeks.length > 0 &&
      week !== undefined &&
      isSameWeek(current, week.start, {
        weekStartsOn: weekStartsOn,
      })
    ) {
      week.end = weekEnd;
    } else {
      weeks.push({ start: current, end: weekEnd });
    }

    current = new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000); // Move to next week
  }

  return weeks.map((week) => ({
    start: format(week.start, "yyyy-MM-dd", { locale }),
    end: format(week.end, "yyyy-MM-dd", { locale }),
  }));
};

export const isHowManyMonthsBetween = (from: Date, to: Date) => {
  const diff = Math.abs(to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
  return diff / 30;
};

export const getMonthsInRange = (from: Date, to: Date) => {
  const months: { start: string; end: string }[] = [];
  let current = startOfMonth(from);

  while (current <= to) {
    const monthEnd = endOfMonth(current);
    months.push({
      start: format(current, "yyyy-MM-dd"),
      end: format(monthEnd, "yyyy-MM-dd"),
    });
    current = new Date(monthEnd.getTime() + 1);
  }
  return months;
};

export const getGroupedExpensesForRange = (
  expenses: Expense[],
  from: Date,
  to: Date,
) => {
  const filteredExpenses = expenses.filter((expense) =>
    isDateInRange(expense.expenseDate, startOfDay(from), to),
  );

  const expensesByCategory = getExpensesByCategory(filteredExpenses);

  return expensesByCategory;
};

export const getExpensesByCategory = (
  expenses: Expense[],
): { name: string; value: number }[] => {
  const categoryMap = expenses.reduce(
    (acc, expense) => {
      const category = expense.type;
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    },
    {
      OPERATIONAL: 0,
      SALARY: 0,
      EQUIPMENT: 0,
      UTILITIES: 0,
      RENT: 0,
      OTHER: 0,
    } as Record<ExpenseType, number>,
  );

  const expensesByCategory = Object.entries(categoryMap).map(
    ([name, value]) => {
      let label = ExpenseTypes.find((type) => type.value === name)?.label;
      return {
        name: label || name,
        value,
      };
    },
  );

  return expensesByCategory;
};

export const getSummaryData = async (
  expenses: Expense[],
  payments: Payment[],
  from: Date,
  to: Date,
) => {
  // Helper function to calculate date range
  const calculatePreviousPeriod = (start: Date, end: Date) => {
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    const previousStart = new Date(start);
    previousStart.setDate(start.getDate() - diffDays);
    const previousEnd = new Date(end);
    previousEnd.setDate(end.getDate() - diffDays);
    return { previousFrom: previousStart, previousTo: previousEnd };
  };

  // Fetching all patients and confirmed appointments
  const [allPatients, allConfirmedAppointments] = await Promise.all([
    db.patient.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    }),
    db.appointment.findMany({
      select: {
        id: true,
        startTime: true,
        status: true,
      },
      where: {
        status: "CONFIRMED",
      },
    }),
  ]);

  // Calculating metrics for the current period
  const totalPatients = allPatients.filter((patient) =>
    isDateInRange(patient.createdAt, startOfDay(from), endOfDay(to)),
  ).length;

  const totalConfirmedAppointments = allConfirmedAppointments.filter(
    (appointment) =>
      isDateInRange(appointment.startTime, startOfDay(from), endOfDay(to)),
  ).length;

  const totalExpenses = expenses
    .filter((expense) =>
      isDateInRange(expense.expenseDate, startOfDay(from), endOfDay(to)),
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalRevenue = payments
    .filter((payment) =>
      isDateInRange(payment.paymentDate, startOfDay(from), endOfDay(to)),
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netIncome = totalRevenue - totalExpenses;

  // Calculating metrics for the previous period
  const { previousFrom, previousTo } = calculatePreviousPeriod(from, to);

  const previousTotalPatients = allPatients.filter((patient) =>
    isDateInRange(patient.createdAt, previousFrom, previousTo),
  ).length;

  const previousTotalConfirmedAppointments = allConfirmedAppointments.filter(
    (appointment) =>
      isDateInRange(appointment.startTime, previousFrom, previousTo),
  ).length;

  const previousTotalExpenses = expenses
    .filter((expense) =>
      isDateInRange(expense.expenseDate, previousFrom, previousTo),
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const previousTotalRevenue = payments
    .filter((payment) =>
      isDateInRange(payment.paymentDate, previousFrom, previousTo),
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const previousNetIncome = previousTotalRevenue - previousTotalExpenses;

  // Calculating percentage changes
  const totalRevenuePercentage =
    previousTotalRevenue > 0
      ? ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100
      : 0;

  const totalExpensesPercentage =
    previousTotalExpenses > 0
      ? ((totalExpenses - previousTotalExpenses) / previousTotalExpenses) * 100
      : 0;

  const netIncomePercentage =
    previousNetIncome > 0
      ? ((netIncome - previousNetIncome) / previousNetIncome) * 100
      : 0;

  const totalPatientsIncrease = totalPatients - previousTotalPatients;
  const totalAppointmentsIncrease =
    totalConfirmedAppointments - previousTotalConfirmedAppointments;

  // Constructing the summary data
  const summaryData = {
    current: {
      totalExpenses,
      totalRevenue,
      netIncome,
      totalPatients,
      totalConfirmedAppointments,
    },
    previous: {
      totalExpenses: previousTotalExpenses,
      totalRevenue: previousTotalRevenue,
      netIncome: previousNetIncome,
      totalPatients: previousTotalPatients,
      totalConfirmedAppointments: previousTotalConfirmedAppointments,
    },
    percentageChange: {
      totalExpenses: totalExpensesPercentage,
      totalRevenue: totalRevenuePercentage,
      netIncome: netIncomePercentage,
      totalPatients: totalPatientsIncrease,
      totalConfirmedAppointments: totalAppointmentsIncrease,
    },
  };

  return summaryData;
};

// const getSummaryData = async (
//   expenses: Expense[],
//   payments: Payment[],
//   from: Date,
//   to: Date,
// ) => {
//   // current period
//   const allPatients = await db.patient.findMany({
//     select: {
//       id: true,
//       createdAt: true,
//     },
//   });

//   const allConfirmedAppointments = await db.appointment.findMany({
//     select: {
//       id: true,
//       startTime: true,
//       status: true,
//     },
//     where: {
//       status: "CONFIRMED",
//     },
//   });

//   const totalPatients = allPatients.filter((patient) =>
//     isDateInRange(patient.createdAt, startOfDay(from), endOfDay(to)),
//   ).length;

//   const totalConfirmedAppointments = allConfirmedAppointments.filter(
//     (appointment) =>
//       isDateInRange(appointment.startTime, startOfDay(from), endOfDay(to)),
//   ).length;

//   const totalExpenses = expenses
//     .filter((expense) =>
//       isDateInRange(expense.expenseDate, startOfDay(from), endOfDay(to)),
//     )
//     .reduce((acc, curr) => acc + curr.amount, 0);
//   const totalRevenue = payments
//     .filter((payment) =>
//       isDateInRange(payment.paymentDate, startOfDay(from), endOfDay(to)),
//     )
//     .reduce((acc, curr) => acc + curr.amount, 0);
//   const netIncome = totalRevenue - totalExpenses;

//   // previous period
//   const TotalDaysBetween = Math.floor(
//     isHowManyMonthsBetween(from, endOfDay(to)),
//   );
//   const previousFrom = new Date(from);
//   previousFrom.setMonth(previousFrom.getMonth() - TotalDaysBetween);
//   const previousTo = new Date(to);
//   previousTo.setMonth(previousTo.getMonth() - TotalDaysBetween);

//   const previousTotalPatients = allPatients.filter((patient) =>
//     isDateInRange(patient.createdAt, previousFrom, previousTo),
//   ).length;

//   const previousTotalConfirmedAppointments = allConfirmedAppointments.filter(
//     (appointment) =>
//       isDateInRange(appointment.startTime, previousFrom, previousTo),
//   ).length;

//   const previousTotalExpenses = expenses
//     .filter((expense) =>
//       isDateInRange(expense.expenseDate, previousFrom, previousTo),
//     )
//     .reduce((acc, curr) => acc + curr.amount, 0);

//   const previousTotalRevenue = payments
//     .filter((payment) =>
//       isDateInRange(payment.paymentDate, previousFrom, previousTo),
//     )
//     .reduce((acc, curr) => acc + curr.amount, 0);

//   const previousNetIncome = previousTotalRevenue - previousTotalExpenses;

//   const totalRevenuePercentage =
//     totalRevenue > 0
//       ? ((totalRevenue - previousTotalRevenue) / totalRevenue) * 100
//       : 0;

//   const totalExpensesPercentage =
//     totalExpenses > 0
//       ? ((totalExpenses - previousTotalExpenses) / totalExpenses) * 100
//       : 0;

//   const netIncomePercentage =
//     netIncome > 0 ? ((netIncome - previousNetIncome) / netIncome) * 100 : 0;

//   const totalPatientsIncrease = totalPatients - previousTotalPatients;
//   const totalAppointmentsIncrease =
//     totalConfirmedAppointments - previousTotalConfirmedAppointments;
//   const summaryData = {
//     current: {
//       totalExpenses,
//       totalRevenue,
//       netIncome,
//       totalPatients,
//       totalConfirmedAppointments,
//     },
//     previous: {
//       totalExpenses: previousTotalExpenses,
//       totalRevenue: previousTotalRevenue,
//       netIncome: previousNetIncome,
//       totalPatients: previousTotalPatients,
//       totalConfirmedAppointments: previousTotalConfirmedAppointments,
//     },
//     percentageChange: {
//       totalExpenses: totalExpensesPercentage,
//       totalRevenue: totalRevenuePercentage,
//       netIncome: netIncomePercentage,
//       totalPatients: totalPatientsIncrease,
//       totalConfirmedAppointments: totalAppointmentsIncrease,
//     },
//   };

//   return summaryData;
// };

/**
 * prisma schema:
 * 
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
    startTime   DateTime          @map("start_time")
    endTime     DateTime          @map("end_time")
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
