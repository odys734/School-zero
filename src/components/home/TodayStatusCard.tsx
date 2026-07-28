import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, ArrowRight, Sun, Sparkles, Palmtree, UserMinus, ShieldCheck } from 'lucide-react';
import { AttendanceRecord, Exam, Holiday, PersonalLeave, SchoolConfig, Vacation } from '../../types';
import { classifyDate, findNextSchoolDay } from '../../utils/calculator';
import { addDays, formatDateString, getDayName, getTodayString } from '../../utils/dateUtils';

interface TodayStatusCardProps {
  config: SchoolConfig;
  holidays: Holiday[];
  vacations: Vacation[];
  personalLeaves: PersonalLeave[];
  exams: Exam[];
  attendance: AttendanceRecord[];
  onToggleAttendance: (dateStr: string, status: 'attended' | 'absent' | 'leave') => void;
}

export const TodayStatusCard: React.FC<TodayStatusCardProps> = ({
  config,
  holidays,
  vacations,
  personalLeaves,
  exams,
  attendance,
  onToggleAttendance,
}) => {
  const todayStr = getTodayString();
  const dayClass = classifyDate(todayStr, config, holidays, vacations, personalLeaves, exams, attendance);

  const [timeStatusText, setTimeStatusText] = useState<string>('');
  const [sessionState, setSessionState] = useState<'before' | 'during' | 'after'>('before');

  const startTime = config.schoolStartTime || '08:00';
  const endTime = config.schoolEndTime || '14:00';

  useEffect(() => {
    const updateTiming = () => {
      const now = new Date();
      const [startH, startM] = startTime.split(':').map((n) => parseInt(n, 10) || 0);
      const [endH, endM] = endTime.split(':').map((n) => parseInt(n, 10) || 0);

      const startObj = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startH, startM, 0);
      const endObj = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endH, endM, 0);

      const nowMs = now.getTime();

      if (nowMs < startObj.getTime()) {
        const diffMins = Math.floor((startObj.getTime() - nowMs) / (1000 * 60));
        const hrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        setSessionState('before');
        setTimeStatusText(`School starts at ${startTime} (in ${hrs > 0 ? `${hrs}h ` : ''}${mins}m)`);
      } else if (nowMs >= startObj.getTime() && nowMs < endObj.getTime()) {
        const diffMins = Math.floor((endObj.getTime() - nowMs) / (1000 * 60));
        const hrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        setSessionState('during');
        setTimeStatusText(`School in progress - Ends at ${endTime} (${hrs > 0 ? `${hrs}h ` : ''}${mins}m remaining)`);
      } else {
        setSessionState('after');
        setTimeStatusText(`School finished for today (${startTime} - ${endTime})`);
      }
    };

    updateTiming();
    const interval = setInterval(updateTiming, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  // Find next school day if today is off
  const nextSchoolDay = dayClass.isOff
    ? findNextSchoolDay(addDays(todayStr, 1), config, holidays, vacations, personalLeaves, exams)
    : null;

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${dayClass.isOff ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'}`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Today's Status
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {formatDateString(todayStr, 'short')}
            </h3>
          </div>
        </div>

        {dayClass.isOff ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
            OFF TODAY
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
            SCHOOL DAY
          </span>
        )}
      </div>

      {/* OFF TODAY CARD */}
      {dayClass.isOff ? (
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-semibold text-xs">
            {dayClass.holiday && <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />}
            {dayClass.vacation && <Palmtree className="w-4 h-4 text-purple-500 shrink-0" />}
            {dayClass.isWeeklyOff && <Sun className="w-4 h-4 text-amber-500 shrink-0" />}
            <span>
              {dayClass.holiday
                ? `Holiday: ${dayClass.holiday.name}`
                : dayClass.vacation
                ? `Vacation: ${dayClass.vacation.name}`
                : dayClass.personalLeave
                ? `Personal Leave: ${dayClass.personalLeave.reason || 'Planned'}`
                : `${getDayName(dayClass.dayOfWeek)} Weekly Off`}
            </span>
          </div>

          {nextSchoolDay && (
            <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs text-indigo-800 dark:text-indigo-300">
              <span>Next school day:</span>
              <span className="font-bold flex items-center gap-1 text-slate-900 dark:text-slate-100">
                {nextSchoolDay.formatted}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          )}
        </div>
      ) : (
        /* SCHOOL DAY CARD */
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {timeStatusText}
            </span>
            <span className={`w-2 h-2 rounded-full shrink-0 ${sessionState === 'during' ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          </div>

          {/* Quick Attendance Mark */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Attendance Record:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleAttendance(todayStr, 'attended')}
                className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  dayClass.attendance?.status === 'attended' || !dayClass.attendance
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Attended</span>
              </button>

              <button
                onClick={() => onToggleAttendance(todayStr, 'absent')}
                className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  dayClass.attendance?.status === 'absent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Absent</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
