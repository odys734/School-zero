import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Palmtree,
  ArrowRight,
  Plus,
  Info,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Zap,
} from 'lucide-react';
import {
  AppSettings,
  AttendanceRecord,
  CalculationResult,
  Exam,
  Holiday,
  PersonalLeave,
  SchoolConfig,
  UserProfile,
  Vacation,
} from '../../types';
import { formatDateString } from '../../utils/dateUtils';
import { LiveCountdown } from './LiveCountdown';
import { TodayStatusCard } from './TodayStatusCard';
import { ZeroDayCelebration } from './ZeroDayCelebration';

interface HomeScreenProps {
  profile: UserProfile;
  config: SchoolConfig;
  settings: AppSettings;
  calcResult: CalculationResult;
  holidays: Holiday[];
  vacations: Vacation[];
  personalLeaves: PersonalLeave[];
  exams: Exam[];
  attendance: AttendanceRecord[];
  onToggleAttendance: (dateStr: string, status: 'attended' | 'absent' | 'leave') => void;
  onNavigateTab: (tab: 'calendar' | 'leaves' | 'progress' | 'settings') => void;
  onOpenLeaveModal: () => void;
  onOpenHolidayModal: () => void;
  onOpenVacationModal: () => void;
  onOpenBreakdown: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  config,
  settings,
  calcResult,
  holidays,
  vacations,
  personalLeaves,
  exams,
  attendance,
  onToggleAttendance,
  onNavigateTab,
  onOpenLeaveModal,
  onOpenHolidayModal,
  onOpenVacationModal,
  onOpenBreakdown,
  onUpdateSettings,
}) => {
  const [liveCountdownTarget, setLiveCountdownTarget] = useState<
    'final' | 'next_off' | 'next_holiday' | 'next_vacation'
  >(settings.liveCountdownTarget || 'final');

  const isZeroDay = calcResult.officialSchoolDaysLeft <= 0;

  // Primary count toggle mode (Official vs Estimated)
  const isEstimatedMode = settings.primaryCountdownMode === 'estimated';
  const displayCount = isEstimatedMode
    ? calcResult.estimatedDaysWillAttend
    : calcResult.officialSchoolDaysLeft;

  const toggleCountMode = () => {
    const nextMode = isEstimatedMode ? 'official' : 'estimated';
    onUpdateSettings({ primaryCountdownMode: nextMode });
  };

  return (
    <div className="space-y-5 pb-24 max-w-md mx-auto">
      {/* Zero Day State */}
      {isZeroDay ? (
        <ZeroDayCelebration
          calcResult={calcResult}
          config={config}
          onChangeTargetClick={() => onNavigateTab('settings')}
          onViewJourneyClick={() => onNavigateTab('progress')}
          onNewCountdownClick={() => onNavigateTab('settings')}
        />
      ) : (
        <>
          {/* Main Hero: SCHOOL DAYS LEFT */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs relative overflow-hidden transition-all">
            {/* Mode selector badge */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={toggleCountMode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>
                  {isEstimatedMode ? 'Estimated Attendance' : 'Official School Days'}
                </span>
                <span className="text-[9px] text-emerald-600/70 dark:text-emerald-400/70 ml-0.5 underline">
                  (switch)
                </span>
              </button>

              <button
                onClick={onOpenBreakdown}
                title="View exact calculation formula"
                className="text-[11px] text-slate-500 hover:text-emerald-600 dark:text-slate-400 flex items-center gap-1 font-medium"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Math</span>
              </button>
            </div>

            {/* Giant Number Focus */}
            <div className="text-center py-2">
              <span className="text-7xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 block">
                {displayCount}
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">
                {isEstimatedMode ? 'Estimated Days Left' : 'School Days Left'}
              </span>

              {isEstimatedMode && calcResult.plannedPersonalLeavesCount > 0 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                  Subtracting {calcResult.plannedPersonalLeavesCount} planned personal leave(s)
                </p>
              )}
            </div>

            {/* Target info */}
            <div className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-3 flex items-center justify-center gap-1.5">
              <span>Target:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {formatDateString(config.targetDate, 'medium')}
              </strong>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                ({calcResult.totalCalendarDays} calendar days)
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Journey Progress</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {calcResult.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${calcResult.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* TODAY STATUS & TIMING CARD */}
          <TodayStatusCard
            config={config}
            holidays={holidays}
            vacations={vacations}
            personalLeaves={personalLeaves}
            exams={exams}
            attendance={attendance}
            onToggleAttendance={onToggleAttendance}
          />

          {/* NEXT OFF BANNER (Prominent focus) */}
          {calcResult.nextOff && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100 opacity-90 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    {calcResult.nextOff.isToday ? 'OFF TODAY' : 'NEXT OFF'}
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-white">
                    {calcResult.nextOff.title}
                  </h3>
                  <p className="text-xs text-emerald-100/90 mt-0.5">
                    {formatDateString(calcResult.nextOff.date, 'full')}
                  </p>
                </div>

                <div className="bg-emerald-800/60 px-3 py-1.5 rounded-2xl text-center shrink-0">
                  <span className="block text-2xl font-black font-mono text-white">
                    {calcResult.nextOff.isToday ? '0' : calcResult.nextOff.daysLeft}
                  </span>
                  <span className="text-[10px] font-medium uppercase text-emerald-100">
                    {calcResult.nextOff.daysLeft === 1 ? 'Day Left' : 'Days Left'}
                  </span>
                </div>
              </div>

              {/* Continuous off block & resume date */}
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">
                    {calcResult.nextOff.continuousDaysOff > 1
                      ? `${calcResult.nextOff.continuousDaysOff} days continuous off`
                      : '1 day off'}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-white">
                  <span>School resumes {calcResult.nextOff.resumeDayName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* TRI-GRID: NEXT WEEKLY OFF, NEXT HOLIDAY, NEXT VACATION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Next Weekly Off */}
            <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                  Next Weekly Off
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                  {calcResult.nextWeeklyOff?.dayName || 'None'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {calcResult.nextWeeklyOff
                    ? formatDateString(calcResult.nextWeeklyOff.date, 'month_day')
                    : 'No weekly offs'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-[10px] text-slate-400">In</span>
                <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {calcResult.nextWeeklyOff
                    ? `${calcResult.nextWeeklyOff.daysLeft} d`
                    : '—'}
                </span>
              </div>
            </div>

            {/* Next Holiday */}
            <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                  Next Holiday
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block truncate">
                  {calcResult.nextHoliday?.title || 'None Configured'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {calcResult.nextHoliday
                    ? formatDateString(calcResult.nextHoliday.date, 'month_day')
                    : 'Add school holidays'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-[10px] text-slate-400">In</span>
                <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                  {calcResult.nextHoliday
                    ? `${calcResult.nextHoliday.daysLeft} d`
                    : '—'}
                </span>
              </div>
            </div>

            {/* Next Vacation */}
            <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                  Next Vacation
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block truncate">
                  {calcResult.nextVacation?.name || 'No Vacations'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {calcResult.nextVacation
                    ? `${formatDateString(calcResult.nextVacation.startDate, 'month_day')} - ${formatDateString(calcResult.nextVacation.endDate, 'month_day')}`
                    : 'Set vacation ranges'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-[10px] text-slate-400">
                  {calcResult.nextVacation?.isActiveNow ? 'Active now' : 'In'}
                </span>
                <span className="text-base font-bold font-mono text-purple-600 dark:text-purple-400">
                  {calcResult.nextVacation
                    ? calcResult.nextVacation.isActiveNow
                      ? `${calcResult.nextVacation.daysRemainingInVacation} d left`
                      : `${calcResult.nextVacation.daysLeft} d`
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Optional Live Countdown Ticker */}
          {settings.showLiveCountdown && (
            <LiveCountdown
              config={config}
              calcResult={calcResult}
              targetType={liveCountdownTarget}
              onChangeTargetType={(target) => {
                setLiveCountdownTarget(target);
                onUpdateSettings({ liveCountdownTarget: target });
              }}
            />
          )}

          {/* Quick Action Bar */}
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2 px-1">
              Quick Actions
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenLeaveModal}
                className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 text-left"
              >
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Plan Leave
                  </span>
                  <span className="text-[10px] text-slate-500">Add personal leave</span>
                </div>
              </button>

              <button
                onClick={onOpenHolidayModal}
                className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 text-left"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Add Holiday
                  </span>
                  <span className="text-[10px] text-slate-500">School festival / off</span>
                </div>
              </button>

              <button
                onClick={onOpenVacationModal}
                className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 text-left"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
                  <Palmtree className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Add Vacation
                  </span>
                  <span className="text-[10px] text-slate-500">Multi-day break range</span>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('calendar')}
                className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 text-left"
              >
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Open Calendar
                  </span>
                  <span className="text-[10px] text-slate-500">View monthly grid</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
