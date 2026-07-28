export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, ... 6 = Saturday

export type HolidayCategory = 'festival' | 'national' | 'school' | 'custom';
export type VacationCategory = 'summer' | 'winter' | 'diwali' | 'spring' | 'exam' | 'session' | 'custom';

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  category?: HolidayCategory;
  notes?: string;
  enabled: boolean;
}

export interface Vacation {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  category?: VacationCategory;
  notes?: string;
}

export interface PersonalLeave {
  id: string;
  date: string; // YYYY-MM-DD
  reason?: string;
  status: 'planned' | 'taken';
  notes?: string;
}

export interface Exam {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  isSchoolDay: boolean; // True = regular school day with exam, False = non-school exam day
  subject?: string;
  notes?: string;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: 'attended' | 'absent' | 'leave';
  notes?: string;
}

export interface UserProfile {
  name: string;
  userClass: string;
  avatarIcon?: string;
}

export interface SchoolConfig {
  startDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
  targetTime: string; // HH:MM (e.g., "08:00")
  schoolStartTime?: string; // HH:MM (e.g. "08:00")
  schoolEndTime?: string; // HH:MM (e.g. "14:00")
  weeklyOffs: number[]; // Array of DayOfWeek numbers, e.g. [0] for Sunday, [0, 6] for Sat & Sun
}

export interface SchoolAlarm {
  id: string;
  title: string;
  time: string; // HH:MM (e.g., "06:30")
  enabled: boolean;
  snoozeDurationMinutes: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  daysOfWeek: number[]; // e.g. [1, 2, 3, 4, 5]
}

export interface AppSettings {
  primaryCountdownMode: 'official' | 'estimated';
  showLiveCountdown: boolean;
  liveCountdownTarget: 'final' | 'next_off' | 'next_holiday' | 'next_vacation';
  leaveForecastPerMonth: number; // 0 = disabled
  enableNotifications: boolean;
  dailyNotificationTime: string; // HH:MM
  notificationCategories: {
    dailyCountdown: boolean;
    holidayReminder: boolean;
    vacationReminder: boolean;
    milestones: boolean;
    zeroDay: boolean;
  };
  theme: 'system' | 'light' | 'dark';
  hasCompletedOnboarding: boolean;
}

export type DayType = 
  | 'school_day' 
  | 'weekly_off' 
  | 'holiday' 
  | 'vacation' 
  | 'personal_leave' 
  | 'exam_non_school' 
  | 'exam_school' 
  | 'custom_off';

export interface DayClassification {
  date: string; // YYYY-MM-DD
  dayOfWeek: number;
  isOff: boolean; // Mathematically an OFF day (whether weekly off, holiday, vacation, or custom)
  isOfficialSchoolDay: boolean; // Scheduled school day (not weekly off, not holiday, not vacation, not non-school exam)
  primaryType: DayType;
  reasons: string[];
  isWeeklyOff: boolean;
  holiday?: Holiday;
  vacation?: Vacation;
  personalLeave?: PersonalLeave;
  exam?: Exam;
  attendance?: AttendanceRecord;
}

export interface Milestone {
  targetValue: number;
  reached: boolean;
  reachedDate?: string;
}

export interface NextOffInfo {
  date: string;
  title: string;
  type: 'weekly_off' | 'holiday' | 'vacation' | 'personal_leave';
  daysLeft: number;
  isToday: boolean;
  resumeDate: string;
  resumeDayName: string;
  continuousDaysOff: number;
}

export interface NextWeeklyOffInfo {
  date: string;
  dayName: string;
  daysLeft: number;
}

export interface NextHolidayInfo {
  id: string;
  date: string;
  title: string;
  category?: string;
  daysLeft: number;
}

export interface NextVacationInfo {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  daysRemainingInVacation?: number;
  isActiveNow: boolean;
  resumeDate: string;
}

export interface CalculationResult {
  startDate: string;
  targetDate: string;
  todayDate: string;
  
  // Factual totals for the target window [startDate to targetDate - 1]
  totalCalendarDays: number;
  officialWeeklyOffsCount: number; // Pure weekly offs on scheduled school days
  officialHolidaysCount: number;  // Holidays falling on working school days
  officialVacationSchoolDaysCount: number; // Vacation days that would otherwise be working school days
  
  // The two core counts
  officialSchoolDaysLeft: number; // From Max(today, startDate) to targetDate - 1
  estimatedDaysWillAttend: number; // officialSchoolDaysLeft minus planned personal leaves
  
  // Historical completion counts (from startDate to yesterday)
  officialSchoolDaysCompleted: number;
  totalOfficialSchoolDays: number; // Completed + Left
  
  // Personal leave metrics
  plannedPersonalLeavesCount: number; // Future valid leaves on official school days
  takenPersonalLeavesCount: number;   // Past leaves taken
  
  // Attendance history metrics
  attendedSchoolDaysCount: number;
  totalPastSchoolDays: number;
  attendancePercentage: number;
  
  // Overall progress
  progressPercentage: number;
  
  // Next upcoming events
  nextOff: NextOffInfo | null;
  nextWeeklyOff: NextWeeklyOffInfo | null;
  nextHoliday: NextHolidayInfo | null;
  nextVacation: NextVacationInfo | null;
  
  // Milestones
  milestones: Milestone[];
}

export interface FullAppData {
  version: number;
  profile: UserProfile;
  config: SchoolConfig;
  holidays: Holiday[];
  vacations: Vacation[];
  personalLeaves: PersonalLeave[];
  exams: Exam[];
  attendance: AttendanceRecord[];
  alarms?: SchoolAlarm[];
  settings: AppSettings;
}
