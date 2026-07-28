// Robust local date utilities avoiding UTC timezone offsets

export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date();
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day, 0, 0, 0, 0);
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return formatLocalDate(new Date());
}

export function getDayOfWeek(dateStr: string): number {
  return parseLocalDate(dateStr).getDay();
}

export const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getDayName(dayIndex: number, short = false): string {
  return short ? DAY_NAMES_SHORT[dayIndex] : DAY_NAMES_FULL[dayIndex];
}

export function addDays(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatLocalDate(d);
}

export function getDaysDifference(startDateStr: string, endDateStr: string): number {
  const start = parseLocalDate(startDateStr).getTime();
  const end = parseLocalDate(endDateStr).getTime();
  const diffTime = end - start;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function isDateInRange(dateStr: string, startDateStr: string, endDateStr: string): boolean {
  return dateStr >= startDateStr && dateStr <= endDateStr;
}

export function formatDateString(dateStr: string, style: 'full' | 'medium' | 'short' | 'month_day' | 'relative' = 'medium'): string {
  if (!dateStr) return '';
  const date = parseLocalDate(dateStr);
  const todayStr = getTodayString();
  
  if (style === 'relative') {
    const diff = getDaysDifference(todayStr, dateStr);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
  }

  const dayName = DAY_NAMES_SHORT[date.getDay()];
  const fullDayName = DAY_NAMES_FULL[date.getDay()];
  const dayNum = date.getDate();
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNamesFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthShort = monthNamesShort[date.getMonth()];
  const monthFull = monthNamesFull[date.getMonth()];
  const year = date.getFullYear();

  switch (style) {
    case 'full':
      return `${fullDayName}, ${dayNum} ${monthFull} ${year}`;
    case 'medium':
      return `${dayNum} ${monthFull} ${year}`;
    case 'short':
      return `${dayName}, ${dayNum} ${monthShort}`;
    case 'month_day':
      return `${dayNum} ${monthShort}`;
    default:
      return `${dayNum} ${monthShort} ${year}`;
  }
}

export interface CalendarDayItem {
  dateStr: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

export function getCalendarMonthGrid(year: number, month: number /* 0-11 */): CalendarDayItem[] {
  const todayStr = getTodayString();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days: CalendarDayItem[] = [];
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun

  // Days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    const dateStr = formatLocalDate(prevDate);
    days.push({
      dateStr,
      dayOfMonth: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
    });
  }

  // Days of current month
  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    const currDate = new Date(year, month, d);
    const dateStr = formatLocalDate(currDate);
    days.push({
      dateStr,
      dayOfMonth: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
    });
  }

  // Fill remaining slots to make complete weeks (42 cells max for 6 rows)
  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateStr = formatLocalDate(nextDate);
    days.push({
      dateStr,
      dayOfMonth: i,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
    });
  }

  return days;
}
