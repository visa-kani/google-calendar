
// Utility functions
export const formatDate = (date: Date) => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

export const isSameDay = (date1: Date, date2: Date) => {
  return formatDate(date1) === formatDate(date2);
};

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getWeeksInMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days = [];

  // Add previous month's days to fill the first week
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const date = new Date(firstDay);
    date.setDate(date.getDate() - i - 1);
    days.push(date);
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  // Add next month's days to fill the last week
  while (days.length % 7 !== 0) {
    const lastDate:any = days[days.length - 1];
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 1);
    days.push(nextDate);
  }

  // Group into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
};