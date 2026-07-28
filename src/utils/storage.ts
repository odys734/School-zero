import { FullAppData } from '../types';
import { DEFAULT_INITIAL_DATA, SAMPLE_DEMO_DATA } from './sampleData';

const STORAGE_KEY = 'schoolzero_app_data_v1';

export function loadAppData(): FullAppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INITIAL_DATA;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.config) {
      return DEFAULT_INITIAL_DATA;
    }
    return {
      ...DEFAULT_INITIAL_DATA,
      ...parsed,
      profile: { ...DEFAULT_INITIAL_DATA.profile, ...parsed.profile },
      config: { ...DEFAULT_INITIAL_DATA.config, ...parsed.config },
      settings: {
        ...DEFAULT_INITIAL_DATA.settings,
        ...parsed.settings,
        notificationCategories: {
          ...DEFAULT_INITIAL_DATA.settings.notificationCategories,
          ...(parsed.settings?.notificationCategories || {}),
        },
      },
      holidays: Array.isArray(parsed.holidays) ? parsed.holidays : [],
      vacations: Array.isArray(parsed.vacations) ? parsed.vacations : [],
      personalLeaves: Array.isArray(parsed.personalLeaves) ? parsed.personalLeaves : [],
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
      attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
      alarms: Array.isArray(parsed.alarms) ? parsed.alarms : (DEFAULT_INITIAL_DATA.alarms || []),
    };
  } catch (err) {
    console.error('Error reading SchoolZero data from localStorage:', err);
    return DEFAULT_INITIAL_DATA;
  }
}

export function saveAppData(data: FullAppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving SchoolZero data to localStorage:', err);
  }
}

export function resetAppData(): FullAppData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing SchoolZero localStorage:', err);
  }
  return DEFAULT_INITIAL_DATA;
}

export function loadSampleDemoData(): FullAppData {
  saveAppData(SAMPLE_DEMO_DATA);
  return SAMPLE_DEMO_DATA;
}

export function exportAppDataJSON(data: FullAppData): string {
  return JSON.stringify(data, null, 2);
}

export function importAppDataJSON(jsonString: string): FullAppData {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || !parsed.config || !parsed.config.startDate || !parsed.config.targetDate) {
      throw new Error('Invalid SchoolZero backup file format.');
    }
    const validated: FullAppData = {
      version: 1,
      profile: {
        name: parsed.profile?.name || '',
        userClass: parsed.profile?.userClass || '',
      },
      config: {
        startDate: parsed.config.startDate,
        targetDate: parsed.config.targetDate,
        targetTime: parsed.config.targetTime || '08:00',
        schoolStartTime: parsed.config.schoolStartTime || '08:00',
        schoolEndTime: parsed.config.schoolEndTime || '14:00',
        weeklyOffs: Array.isArray(parsed.config.weeklyOffs) ? parsed.config.weeklyOffs : [0],
      },
      holidays: Array.isArray(parsed.holidays) ? parsed.holidays : [],
      vacations: Array.isArray(parsed.vacations) ? parsed.vacations : [],
      personalLeaves: Array.isArray(parsed.personalLeaves) ? parsed.personalLeaves : [],
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
      attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
      alarms: Array.isArray(parsed.alarms) ? parsed.alarms : (DEFAULT_INITIAL_DATA.alarms || []),
      settings: {
        ...DEFAULT_INITIAL_DATA.settings,
        ...(parsed.settings || {}),
        notificationCategories: {
          ...DEFAULT_INITIAL_DATA.settings.notificationCategories,
          ...(parsed.settings?.notificationCategories || {}),
        },
      },
    };
    saveAppData(validated);
    return validated;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to parse JSON backup.');
  }
}
