import { FullAppData } from '../types';

export const SAMPLE_DEMO_DATA: FullAppData = {
  version: 1,
  profile: {
    name: 'Toyesh',
    userClass: 'Class 10',
  },
  config: {
    startDate: '2026-07-28',
    targetDate: '2028-02-01',
    targetTime: '08:00',
    schoolStartTime: '08:00',
    schoolEndTime: '14:00',
    weeklyOffs: [0], // Sunday
  },
  holidays: [
    { id: 'h1', name: 'Independence Day', date: '2026-08-15', category: 'national', enabled: true },
    { id: 'h2', name: 'Raksha Bandhan', date: '2026-08-28', category: 'festival', enabled: true },
    { id: 'h3', name: 'Janmashtami', date: '2026-09-04', category: 'festival', enabled: true },
    { id: 'h4', name: 'Gandhi Jayanti', date: '2026-10-02', category: 'national', enabled: true },
    { id: 'h5', name: 'Dussehra', date: '2026-10-20', category: 'festival', enabled: true },
    { id: 'h6', name: 'Diwali', date: '2026-11-08', category: 'festival', enabled: true },
    { id: 'h7', name: 'Guru Nanak Jayanti', date: '2026-11-24', category: 'festival', enabled: true },
    { id: 'h8', name: 'Christmas', date: '2026-12-25', category: 'festival', enabled: true },
    { id: 'h9', name: 'Republic Day', date: '2027-01-26', category: 'national', enabled: true },
    { id: 'h10', name: 'Holi', date: '2027-03-22', category: 'festival', enabled: true },
    { id: 'h11', name: 'Good Friday', date: '2027-03-26', category: 'festival', enabled: true },
    { id: 'h12', name: 'Independence Day', date: '2027-08-15', category: 'national', enabled: true },
    { id: 'h13', name: 'Dussehra', date: '2027-10-09', category: 'festival', enabled: true },
    { id: 'h14', name: 'Diwali', date: '2027-10-29', category: 'festival', enabled: true },
    { id: 'h15', name: 'Christmas', date: '2027-12-25', category: 'festival', enabled: true },
    { id: 'h16', name: 'Republic Day', date: '2028-01-26', category: 'national', enabled: true },
  ],
  vacations: [
    { id: 'v1', name: 'Diwali Break', startDate: '2026-11-01', endDate: '2026-11-15', category: 'diwali' },
    { id: 'v2', name: 'Winter Vacation', startDate: '2026-12-25', endDate: '2027-01-08', category: 'winter' },
    { id: 'v3', name: 'Summer Vacation', startDate: '2027-05-15', endDate: '2027-07-01', category: 'summer' },
    { id: 'v4', name: 'Diwali Break 2027', startDate: '2027-10-25', endDate: '2027-11-08', category: 'diwali' },
  ],
  personalLeaves: [
    { id: 'l1', date: '2026-08-29', reason: 'Family Function', status: 'planned' },
    { id: 'l2', date: '2026-10-21', reason: 'Post-Dussehra Travel', status: 'planned' },
  ],
  exams: [
    { id: 'e1', name: 'Mid-Term Examinations', date: '2026-09-15', isSchoolDay: true, subject: 'Mathematics' },
    { id: 'e2', name: 'Pre-Board Exams', date: '2027-12-10', isSchoolDay: true, subject: 'All Subjects' },
  ],
  attendance: [],
  alarms: [
    {
      id: 'a1',
      title: 'Wake Up for School',
      time: '06:30',
      enabled: true,
      snoozeDurationMinutes: 5,
      soundEnabled: true,
      vibrationEnabled: true,
      daysOfWeek: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'a2',
      title: 'Leave for School',
      time: '07:30',
      enabled: true,
      snoozeDurationMinutes: 10,
      soundEnabled: true,
      vibrationEnabled: true,
      daysOfWeek: [1, 2, 3, 4, 5, 6],
    },
  ],
  settings: {
    primaryCountdownMode: 'official',
    showLiveCountdown: true,
    liveCountdownTarget: 'final',
    leaveForecastPerMonth: 0,
    enableNotifications: false,
    dailyNotificationTime: '07:30',
    notificationCategories: {
      dailyCountdown: true,
      holidayReminder: true,
      vacationReminder: true,
      milestones: true,
      zeroDay: true,
    },
    theme: 'system',
    hasCompletedOnboarding: true,
  },
};

export const DEFAULT_INITIAL_DATA: FullAppData = {
  version: 1,
  profile: {
    name: '',
    userClass: '',
  },
  config: {
    startDate: new Date().toISOString().split('T')[0],
    targetDate: `${new Date().getFullYear() + 1}-03-31`, // Default end of next March
    targetTime: '08:00',
    schoolStartTime: '08:00',
    schoolEndTime: '14:00',
    weeklyOffs: [0], // Sunday
  },
  holidays: [],
  vacations: [],
  personalLeaves: [],
  exams: [],
  attendance: [],
  alarms: [
    {
      id: 'a1',
      title: 'Wake Up for School',
      time: '06:30',
      enabled: true,
      snoozeDurationMinutes: 5,
      soundEnabled: true,
      vibrationEnabled: true,
      daysOfWeek: [1, 2, 3, 4, 5, 6],
    },
  ],
  settings: {
    primaryCountdownMode: 'official',
    showLiveCountdown: true,
    liveCountdownTarget: 'final',
    leaveForecastPerMonth: 0,
    enableNotifications: false,
    dailyNotificationTime: '07:30',
    notificationCategories: {
      dailyCountdown: true,
      holidayReminder: true,
      vacationReminder: true,
      milestones: true,
      zeroDay: true,
    },
    theme: 'system',
    hasCompletedOnboarding: false,
  },
};
