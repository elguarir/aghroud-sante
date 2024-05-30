import {
  startOfWeek,
  endOfWeek,
  format,
  isSameWeek,
  Locale,
  Day,
  startOfMonth,
  endOfMonth,
  getMonth,
  differenceInMonths,
  addMonths,
  add,
  parse,
} from "date-fns";
import { fr } from "date-fns/locale";

const getWeeksInRange = (
  from: Date,
  to: Date,
  options: { weekStartsOn?: Day; locale?: Locale } = {
    locale: fr,
    weekStartsOn: 1,
  },
) => {
  const { weekStartsOn = 0, locale } = options; // Set defaults

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
      // Check if weeks array is not empty before accessing its elements
      if (weeks.length > 0) {
        week.end = weekEnd; // Extend the previous week
      }
    } else {
      weeks.push({ start: current, end: weekEnd });
    }

    current = new Date(weekEnd.getTime() + 24 * 60 * 60 * 1000); // Move to next week
  }

  return weeks.map((week) => ({
    start: format(week.start, "yyyy-MM-dd", { locale: locale }),
    end: format(week.end, "yyyy-MM-dd", { locale }),
  }));
};

interface MonthRange {
  start: string;
  end: string;
}

const getMonthsInRange = (from: Date, to: Date): MonthRange[] => {
  const months: MonthRange[] = [];
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

// Example usage:
const from = new Date("2024-05-15"); // March 1, 2024 in UTC
const to = new Date("2024-05-31"); // May 31, 2024 in UTC

const months = getMonthsInRange(from, to);