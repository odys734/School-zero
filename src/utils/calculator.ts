import {
  CalculationResult,
  DayClassification,
  DayType,
  Exam,
  Holiday,
  Milestone,
  NextHolidayInfo,
  NextOffInfo,
  NextVacationInfo,
  NextWeeklyOffInfo,
  PersonalLeave,
  SchoolConfig,
  Vacation,
  AttendanceRecord,
} from '../types';
import {
  addDays,
  formatDateString,
  getDayName,
  getDayOfWeek,
  getDaysDifference,
  getTodayString,
  isDateInRange,
} from './dateUtils';

/**
 * Classifies a single date against the configured school schedule,
 * holidays, vacations, personal leaves, and exams.
 */
export function classifyDate(
  dateStr: string,
  config: SchoolConfig,
  holidays: Holiday[],
  vacations: Vacation[],
  personalLeaves: PersonalLeave[],
  exams: Exam[],
  attendanceRecords: AttendanceRecord[] = []
): DayClassification {
  const dayOfWeek = getDayOfWeek(dateStr);
  const isWeeklyOff = config.weeklyOffs.includes(dayOfWeek);

  const holiday = holidays.find((h) => h.enabled && h.date === dateStr);
  const vacation = vacations.find((v) => isDateInRange(dateStr, v.startDate, v.endDate));
  const personalLeave = personalLeaves.find((l) => l.date === dateStr);
  const exam = exams.find((e) => e.date === dateStr);
  const attendance = attendanceRecords.find((a) => a.date === dateStr);

  const reasons: string[] = [];

  if (isWeeklyOff) {
    reasons.push(getDayName(dayOfWeek));
  }
  if (holiday) {
    reasons.push(holiday.name);
  }
  if (vacation) {
    reasons.push(vacation.name);
  }
  if (exam) {
    reasons.push(`Exam: ${exam.name}${exam.subject ? ` (${exam.subject})` : ''}`);
  }
  if (personalLeave) {
    reasons.push(`Leave: ${personalLeave.reason || 'Personal Leave'}`);
  }

  // An OFF day is any day that is a weekly off, a holiday, a vacation, or a non-school exam
  const isNonSchoolExam = !!(exam && !exam.isSchoolDay);
  const isOff = isWeeklyOff || !!holiday || !!vacation || isNonSchoolExam;

  // An official scheduled school day is a day that is NOT off
  const isOfficialSchoolDay = !isOff;

  // Primary type determination
  let primaryType: DayType = 'school_day';
  if (holiday) {
    primaryType = 'holiday';
  } else if (vacation) {
    primaryType = 'vacation';
  } else if (isWeeklyOff) {
    primaryType = 'weekly_off';
  } else if (isNonSchoolExam) {
    primaryType = 'exam_non_school';
  } else if (exam) {
    primaryType = 'exam_school';
  } else if (personalLeave) {
    primaryType = 'personal_leave';
  }

  return {
    date: dateStr,
    dayOfWeek,
    isOff,
    isOfficialSchoolDay,
    primaryType,
    reasons,
    isWeeklyOff,
    holiday,
    vacation,
    personalLeave,
    exam,
    attendance,
  };
}

/**
 * Finds the first working school day on or after a given date.
 */
export function findNextSchoolDay(
  startDateStr: string,
  config: SchoolConfig,
  holidays: Holiday[],
  vacations: Vacation[],
  personalLeaves: PersonalLeave[],
  exams: Exam[],
  maxDaysToScan = 90
): { date: string; dayName: string; formatted: string } {
  let curr = startDateStr;
  for (let i = 0; i < maxDaysToScan; i++) {
    const classification = classifyDate(curr, config, holidays, vacations, personalLeaves, exams);
    if (classification.isOfficialSchoolDay) {
      const dayName = getDayName(classification.dayOfWeek);
      return {
        date: curr,
        dayName,
        formatted: `${dayName}, ${formatDateString(curr, 'month_day')}`,
      };
    }
    curr = addDays(curr, 1);
  }
  const dayName = getDayName(getDayOfWeek(curr));
  return { date: curr, dayName, formatted: formatDateString(curr, 'medium') };
}

/**
 * Core SchoolZero Calculation Engine
 */
export function calculateSchoolZero(
  config: SchoolConfig,
  holidays: Holiday[],
  vacations: Vacation[],
  personalLeaves: PersonalLeave[],
  exams: Exam[],
  attendanceRecords: AttendanceRecord[] = []
): CalculationResult {
  const todayStr = getTodayString();
  const { startDate, targetDate } = config;

  // Calculation window starts at max(today, startDate) for "days left"
  const calcStart = todayStr > startDate ? todayStr : startDate;

  // Total calendar days from calcStart to targetDate - 1
  const totalCalendarDays = Math.max(0, getDaysDifference(calcStart, targetDate));

  let officialSchoolDaysLeft = 0;
  let officialWeeklyOffsCount = 0;
  let officialHolidaysCount = 0;
  let officialVacationSchoolDaysCount = 0;
  let plannedPersonalLeavesCount = 0;

  // Loop through all future calendar days until targetDate - 1
  let currDate = calcStart;
  while (currDate < targetDate) {
    const day = classifyDate(currDate, config, holidays, vacations, personalLeaves, exams, attendanceRecords);

    if (day.isOfficialSchoolDay) {
      officialSchoolDaysLeft++;
      if (day.personalLeave && day.personalLeave.status === 'planned') {
        plannedPersonalLeavesCount++;
      }
    } else {
      // Categorize the OFF day uniquely (Overlap rule: prioritize classification for statistics)
      if (day.isWeeklyOff) {
        officialWeeklyOffsCount++;
      } else if (day.holiday) {
        officialHolidaysCount++;
      } else if (day.vacation) {
        officialVacationSchoolDaysCount++;
      }
    }

    currDate = addDays(currDate, 1);
  }

  const estimatedDaysWillAttend = Math.max(0, officialSchoolDaysLeft - plannedPersonalLeavesCount);

  // Past school days calculation (from startDate to yesterday)
  let officialSchoolDaysCompleted = 0;
  let takenPersonalLeavesCount = 0;
  let attendedSchoolDaysCount = 0;
  let totalPastSchoolDays = 0;

  let pastDate = startDate;
  while (pastDate < todayStr && pastDate < targetDate) {
    const day = classifyDate(pastDate, config, holidays, vacations, personalLeaves, exams, attendanceRecords);
    if (day.isOfficialSchoolDay) {
      officialSchoolDaysCompleted++;
      totalPastSchoolDays++;

      if (day.attendance?.status === 'attended') {
        attendedSchoolDaysCount++;
      } else if (day.attendance?.status === 'leave' || day.personalLeave?.status === 'taken') {
        takenPersonalLeavesCount++;
      } else {
        // Default to attended if no explicit absent record
        attendedSchoolDaysCount++;
      }
    }
    pastDate = addDays(pastDate, 1);
  }

  const totalOfficialSchoolDays = officialSchoolDaysCompleted + officialSchoolDaysLeft;
  const progressPercentage =
    totalOfficialSchoolDays > 0
      ? Math.min(100, Math.round((officialSchoolDaysCompleted / totalOfficialSchoolDays) * 100))
      : 0;

  const attendancePercentage =
    totalPastSchoolDays > 0
      ? Math.round((attendedSchoolDaysCount / totalPastSchoolDays) * 100)
      : 100;

  // Next Off calculation
  let nextOff: NextOffInfo | null = null;
  let scanDate = todayStr;
  const maxScanWindow = 180; // Scan up to 6 months ahead

  for (let i = 0; i < maxScanWindow; i++) {
    const day = classifyDate(scanDate, config, holidays, vacations, personalLeaves, exams);
    if (day.isOff || day.personalLeave) {
      const isToday = scanDate === todayStr;
      const daysLeft = getDaysDifference(todayStr, scanDate);

      // Determine continuous block of off days
      let continuous = 1;
      let blockEnd = scanDate;
      while (continuous < 60) {
        const nextInBlock = addDays(blockEnd, 1);
        const nextDayClass = classifyDate(nextInBlock, config, holidays, vacations, personalLeaves, exams);
        if (nextDayClass.isOff || nextDayClass.personalLeave) {
          continuous++;
          blockEnd = nextInBlock;
        } else {
          break;
        }
      }

      const nextWorkDay = findNextSchoolDay(addDays(blockEnd, 1), config, holidays, vacations, personalLeaves, exams);

      let title = 'Day Off';
      let type: NextOffInfo['type'] = 'weekly_off';

      if (day.holiday) {
        title = day.holiday.name;
        type = 'holiday';
      } else if (day.vacation) {
        title = day.vacation.name;
        type = 'vacation';
      } else if (day.personalLeave) {
        title = `Personal Leave: ${day.personalLeave.reason || 'Planned'}`;
        type = 'personal_leave';
      } else if (day.isWeeklyOff) {
        title = `${getDayName(day.dayOfWeek)} (Weekly Off)`;
        type = 'weekly_off';
      }

      nextOff = {
        date: scanDate,
        title,
        type,
        daysLeft,
        isToday,
        resumeDate: nextWorkDay.date,
        resumeDayName: nextWorkDay.dayName,
        continuousDaysOff: continuous,
      };
      break;
    }
    scanDate = addDays(scanDate, 1);
  }

  // Next Weekly Off
  let nextWeeklyOff: NextWeeklyOffInfo | null = null;
  scanDate = todayStr;
  for (let i = 0; i < 14; i++) {
    const day = classifyDate(scanDate, config, holidays, vacations, personalLeaves, exams);
    if (day.isWeeklyOff) {
      nextWeeklyOff = {
        date: scanDate,
        dayName: getDayName(day.dayOfWeek),
        daysLeft: getDaysDifference(todayStr, scanDate),
      };
      break;
    }
    scanDate = addDays(scanDate, 1);
  }

  // Next Holiday
  let nextHoliday: NextHolidayInfo | null = null;
  const upcomingHolidays = holidays
    .filter((h) => h.enabled && h.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcomingHolidays.length > 0) {
    const targetH = upcomingHolidays[0];
    nextHoliday = {
      id: targetH.id,
      date: targetH.date,
      title: targetH.name,
      category: targetH.category,
      daysLeft: getDaysDifference(todayStr, targetH.date),
    };
  }

  // Next Vacation
  let nextVacation: NextVacationInfo | null = null;
  const sortedVacations = [...vacations].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const activeOrUpcomingVacation = sortedVacations.find((v) => v.endDate >= todayStr);

  if (activeOrUpcomingVacation) {
    const isActiveNow = activeOrUpcomingVacation.startDate <= todayStr && todayStr <= activeOrUpcomingVacation.endDate;
    const daysLeft = Math.max(0, getDaysDifference(todayStr, activeOrUpcomingVacation.startDate));
    const daysRemainingInVacation = isActiveNow
      ? Math.max(0, getDaysDifference(todayStr, activeOrUpcomingVacation.endDate))
      : undefined;

    const resumeInfo = findNextSchoolDay(
      addDays(activeOrUpcomingVacation.endDate, 1),
      config,
      holidays,
      vacations,
      personalLeaves,
      exams
    );

    nextVacation = {
      id: activeOrUpcomingVacation.id,
      name: activeOrUpcomingVacation.name,
      startDate: activeOrUpcomingVacation.startDate,
      endDate: activeOrUpcomingVacation.endDate,
      daysLeft,
      daysRemainingInVacation,
      isActiveNow,
      resumeDate: resumeInfo.formatted,
    };
  }

  // Milestones
  const milestoneValues = [250, 200, 150, 100, 50, 30, 10, 5, 1, 0];
  const milestones: Milestone[] = milestoneValues.map((val) => ({
    targetValue: val,
    reached: officialSchoolDaysLeft <= val,
  }));

  return {
    startDate,
    targetDate,
    todayDate: todayStr,
    totalCalendarDays,
    officialWeeklyOffsCount,
    officialHolidaysCount,
    officialVacationSchoolDaysCount,
    officialSchoolDaysLeft,
    officialSchoolDaysCompleted,
    totalOfficialSchoolDays,
    plannedPersonalLeavesCount,
    estimatedDaysWillAttend,
    takenPersonalLeavesCount,
    attendedSchoolDaysCount,
    totalPastSchoolDays,
    attendancePercentage,
    progressPercentage,
    nextOff,
    nextWeeklyOff,
    nextHoliday,
    nextVacation,
    milestones,
  };
}
