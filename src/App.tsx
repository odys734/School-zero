import React, { useEffect, useState } from 'react';
import {
  AppSettings,
  Exam,
  FullAppData,
  Holiday,
  PersonalLeave,
  SchoolAlarm,
  SchoolConfig,
  UserProfile,
  Vacation,
} from './types';
import { calculateSchoolZero, classifyDate } from './utils/calculator';
import { getTodayString } from './utils/dateUtils';
import { loadAppData, loadSampleDemoData, resetAppData, saveAppData } from './utils/storage';

// Navigation & Header
import { BottomNav, NavTab } from './components/common/BottomNav';
import { Header } from './components/common/Header';

// Screens
import { CalendarScreen } from './components/calendar/CalendarScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { LeavesScreen } from './components/leaves/LeavesScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { ProgressScreen } from './components/progress/ProgressScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';

// Modals
import { AlarmModal } from './components/alarms/AlarmModal';
import { RingingAlarmBanner } from './components/alarms/RingingAlarmBanner';
import { BreakdownModal } from './components/home/BreakdownModal';
import { ExamModal } from './components/modals/ExamModal';
import { HolidayModal } from './components/modals/HolidayModal';
import { LeaveModal } from './components/modals/LeaveModal';
import { VacationModal } from './components/modals/VacationModal';

export default function App() {
  const [appData, setAppData] = useState<FullAppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Modals state
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [activeRingingAlarm, setActiveRingingAlarm] = useState<SchoolAlarm | null>(null);
  const [editingAlarm, setEditingAlarm] = useState<SchoolAlarm | undefined>(undefined);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>(undefined);

  // Monitor Smart Alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const dayOfWeek = now.getDay();
      const todayStr = getTodayString();

      const dayClass = classifyDate(
        todayStr,
        appData.config,
        appData.holidays,
        appData.vacations,
        appData.personalLeaves,
        appData.exams,
        appData.attendance
      );

      // Smart Suppression: If today is off, alarm is suppressed!
      if (dayClass.isOff) return;

      const matchingAlarm = (appData.alarms || []).find((a) => {
        if (!a.enabled) return false;
        if (!a.daysOfWeek.includes(dayOfWeek)) return false;
        return a.time === currentHHMM;
      });

      if (matchingAlarm && !activeRingingAlarm) {
        setActiveRingingAlarm(matchingAlarm);
      }
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 10000);
    return () => clearInterval(interval);
  }, [appData, activeRingingAlarm]);

  // Sync dark theme on html element
  useEffect(() => {
    const root = document.documentElement;
    if (appData.settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (appData.settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [appData.settings.theme]);

  // Persist appData whenever updated
  const updateAppData = (updater: (prev: FullAppData) => FullAppData) => {
    setAppData((prev) => {
      const next = updater(prev);
      saveAppData(next);
      return next;
    });
  };

  // Run deterministic date calculation engine
  const calcResult = calculateSchoolZero(
    appData.config,
    appData.holidays,
    appData.vacations,
    appData.personalLeaves,
    appData.exams,
    appData.attendance
  );

  // Handlers
  const handleUpdateProfile = (profileUpdate: Partial<UserProfile>) => {
    updateAppData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate },
    }));
  };

  const handleUpdateConfig = (configUpdate: Partial<SchoolConfig>) => {
    updateAppData((prev) => ({
      ...prev,
      config: { ...prev.config, ...configUpdate },
    }));
  };

  const handleUpdateSettings = (settingsUpdate: Partial<AppSettings>) => {
    updateAppData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settingsUpdate },
    }));
  };

  const handleSaveHoliday = (holidayData: Omit<Holiday, 'id'>) => {
    const newHoliday: Holiday = {
      ...holidayData,
      id: `h_${Date.now()}`,
    };
    updateAppData((prev) => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday],
    }));
  };

  const handleToggleHoliday = (holidayId: string) => {
    updateAppData((prev) => ({
      ...prev,
      holidays: prev.holidays.map((h) =>
        h.id === holidayId ? { ...h, enabled: !h.enabled } : h
      ),
    }));
  };

  const handleRemoveHoliday = (holidayId: string) => {
    updateAppData((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((h) => h.id !== holidayId),
    }));
  };

  const handleSaveVacation = (vacationData: Omit<Vacation, 'id'>) => {
    const newVacation: Vacation = {
      ...vacationData,
      id: `v_${Date.now()}`,
    };
    updateAppData((prev) => ({
      ...prev,
      vacations: [...prev.vacations, newVacation],
    }));
  };

  const handleRemoveVacation = (vacationId: string) => {
    updateAppData((prev) => ({
      ...prev,
      vacations: prev.vacations.filter((v) => v.id !== vacationId),
    }));
  };

  const handleSaveLeave = (leaveData: Omit<PersonalLeave, 'id'>) => {
    const newLeave: PersonalLeave = {
      ...leaveData,
      id: `l_${Date.now()}`,
    };
    updateAppData((prev) => ({
      ...prev,
      personalLeaves: [...prev.personalLeaves, newLeave],
    }));
  };

  const handleRemoveLeave = (leaveId: string) => {
    updateAppData((prev) => ({
      ...prev,
      personalLeaves: prev.personalLeaves.filter((l) => l.id !== leaveId),
    }));
  };

  const handleSaveExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: `e_${Date.now()}`,
    };
    updateAppData((prev) => ({
      ...prev,
      exams: [...prev.exams, newExam],
    }));
  };

  const handleRemoveExam = (examId: string) => {
    updateAppData((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== examId),
    }));
  };

  const handleSaveAlarm = (alarmData: Omit<SchoolAlarm, 'id'>) => {
    if (editingAlarm) {
      updateAppData((prev) => ({
        ...prev,
        alarms: (prev.alarms || []).map((a) =>
          a.id === editingAlarm.id ? { ...alarmData, id: editingAlarm.id } : a
        ),
      }));
      setEditingAlarm(undefined);
    } else {
      const newAlarm: SchoolAlarm = {
        ...alarmData,
        id: `a_${Date.now()}`,
      };
      updateAppData((prev) => ({
        ...prev,
        alarms: [...(prev.alarms || []), newAlarm],
      }));
    }
  };

  const handleToggleAlarm = (alarmId: string) => {
    updateAppData((prev) => ({
      ...prev,
      alarms: (prev.alarms || []).map((a) =>
        a.id === alarmId ? { ...a, enabled: !a.enabled } : a
      ),
    }));
  };

  const handleRemoveAlarm = (alarmId: string) => {
    updateAppData((prev) => ({
      ...prev,
      alarms: (prev.alarms || []).filter((a) => a.id !== alarmId),
    }));
  };

  const handleToggleAttendance = (dateStr: string, status: 'attended' | 'absent' | 'leave') => {
    updateAppData((prev) => {
      const existingIdx = prev.attendance.findIndex((a) => a.date === dateStr);
      let updatedAttendance = [...prev.attendance];

      if (existingIdx >= 0) {
        updatedAttendance[existingIdx] = { date: dateStr, status };
      } else {
        updatedAttendance.push({ date: dateStr, status });
      }

      return {
        ...prev,
        attendance: updatedAttendance,
      };
    });
  };

  const handleResetApp = () => {
    const reset = resetAppData();
    setAppData(reset);
    setActiveTab('home');
  };

  const handleLoadSampleData = () => {
    const sample = loadSampleDemoData();
    setAppData(sample);
  };

  // Render onboarding if user hasn't completed onboarding flow
  if (!appData.settings.hasCompletedOnboarding) {
    return (
      <OnboardingFlow
        onCompleteOnboarding={(completedData) => {
          setAppData(completedData);
          saveAppData(completedData);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Sticky Header */}
      <Header
        profile={appData.profile}
        settings={appData.settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenBreakdown={() => setIsBreakdownOpen(true)}
      />

      {/* Main Tab View Canvas */}
      <main className="p-4">
        {activeTab === 'home' && (
          <HomeScreen
            profile={appData.profile}
            config={appData.config}
            settings={appData.settings}
            calcResult={calcResult}
            holidays={appData.holidays}
            vacations={appData.vacations}
            personalLeaves={appData.personalLeaves}
            exams={appData.exams}
            attendance={appData.attendance}
            onToggleAttendance={handleToggleAttendance}
            onNavigateTab={setActiveTab}
            onOpenLeaveModal={() => {
              setModalInitialDate(undefined);
              setIsLeaveModalOpen(true);
            }}
            onOpenHolidayModal={() => {
              setModalInitialDate(undefined);
              setIsHolidayModalOpen(true);
            }}
            onOpenVacationModal={() => setIsVacationModalOpen(true)}
            onOpenBreakdown={() => setIsBreakdownOpen(true)}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarScreen
            config={appData.config}
            holidays={appData.holidays}
            vacations={appData.vacations}
            personalLeaves={appData.personalLeaves}
            exams={appData.exams}
            attendance={appData.attendance}
            onToggleAttendance={handleToggleAttendance}
            onAddLeaveForDate={(dStr) => {
              setModalInitialDate(dStr);
              setIsLeaveModalOpen(true);
            }}
            onRemoveLeaveForDate={handleRemoveLeave}
            onAddHolidayForDate={(dStr) => {
              setModalInitialDate(dStr);
              setIsHolidayModalOpen(true);
            }}
            onAddExamForDate={(dStr) => {
              setModalInitialDate(dStr);
              setIsExamModalOpen(true);
            }}
          />
        )}

        {activeTab === 'leaves' && (
          <LeavesScreen
            personalLeaves={appData.personalLeaves}
            config={appData.config}
            settings={appData.settings}
            onOpenAddLeaveModal={() => {
              setModalInitialDate(undefined);
              setIsLeaveModalOpen(true);
            }}
            onRemoveLeave={handleRemoveLeave}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressScreen
            calcResult={calcResult}
            config={appData.config}
            onOpenBreakdown={() => setIsBreakdownOpen(true)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            appData={appData}
            onUpdateProfile={handleUpdateProfile}
            onUpdateConfig={handleUpdateConfig}
            onUpdateSettings={handleUpdateSettings}
            onToggleHoliday={handleToggleHoliday}
            onRemoveHoliday={handleRemoveHoliday}
            onRemoveVacation={handleRemoveVacation}
            onRemoveExam={handleRemoveExam}
            onToggleAlarm={handleToggleAlarm}
            onRemoveAlarm={handleRemoveAlarm}
            onOpenHolidayModal={() => {
              setModalInitialDate(undefined);
              setIsHolidayModalOpen(true);
            }}
            onOpenVacationModal={() => setIsVacationModalOpen(true)}
            onOpenExamModal={() => {
              setModalInitialDate(undefined);
              setIsExamModalOpen(true);
            }}
            onOpenAlarmModal={() => {
              setEditingAlarm(undefined);
              setIsAlarmModalOpen(true);
            }}
            onEditAlarm={(alarm) => {
              setEditingAlarm(alarm);
              setIsAlarmModalOpen(true);
            }}
            onLoadSampleData={handleLoadSampleData}
            onResetApp={handleResetApp}
            onImportAppData={(imported) => {
              setAppData(imported);
              saveAppData(imported);
            }}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingLeavesCount={
          appData.personalLeaves.filter((l) => l.status === 'planned').length
        }
      />

      {/* Modals */}
      <BreakdownModal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        calcResult={calcResult}
      />

      <HolidayModal
        isOpen={isHolidayModalOpen}
        onClose={() => setIsHolidayModalOpen(false)}
        onSave={handleSaveHoliday}
        initialDate={modalInitialDate}
      />

      <VacationModal
        isOpen={isVacationModalOpen}
        onClose={() => setIsVacationModalOpen(false)}
        onSave={handleSaveVacation}
      />

      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSave={handleSaveLeave}
        initialDate={modalInitialDate}
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onSave={handleSaveExam}
        initialDate={modalInitialDate}
      />

      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        onSave={handleSaveAlarm}
        initialAlarm={editingAlarm}
      />

      {activeRingingAlarm && (
        <RingingAlarmBanner
          alarm={activeRingingAlarm}
          onDismiss={() => setActiveRingingAlarm(null)}
          onSnooze={(mins) => {
            setActiveRingingAlarm(null);
            setTimeout(() => {
              setActiveRingingAlarm(activeRingingAlarm);
            }, mins * 60 * 1000);
          }}
        />
      )}
    </div>
  );
}
