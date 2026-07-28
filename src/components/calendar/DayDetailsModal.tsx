import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Palmtree,
  Sparkles,
  BookOpen,
  Info,
  Clock,
  Plus,
} from 'lucide-react';
import {
  AttendanceRecord,
  Exam,
  Holiday,
  PersonalLeave,
  SchoolConfig,
  Vacation,
} from '../../types';
import { classifyDate } from '../../utils/calculator';
import { formatDateString, getDayName, getTodayString } from '../../utils/dateUtils';

interface DayDetailsModalProps {
  dateStr: string | null;
  onClose: () => void;
  config: SchoolConfig;
  holidays: Holiday[];
  vacations: Vacation[];
  personalLeaves: PersonalLeave[];
  exams: Exam[];
  attendance: AttendanceRecord[];
  onToggleAttendance: (dateStr: string, status: 'attended' | 'absent' | 'leave') => void;
  onAddLeaveForDate: (dateStr: string) => void;
  onRemoveLeaveForDate: (leaveId: string) => void;
  onAddHolidayForDate: (dateStr: string) => void;
  onAddExamForDate: (dateStr: string) => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  dateStr,
  onClose,
  config,
  holidays,
  vacations,
  personalLeaves,
  exams,
  attendance,
  onToggleAttendance,
  onAddLeaveForDate,
  onRemoveLeaveForDate,
  onAddHolidayForDate,
  onAddExamForDate,
}) => {
  if (!dateStr) return null;

  const todayStr = getTodayString();
  const isPast = dateStr < todayStr;
  const isToday = dateStr === todayStr;

  const dayClass = classifyDate(
    dateStr,
    config,
    holidays,
    vacations,
    personalLeaves,
    exams,
    attendance
  );

  const getStatusBadge = () => {
    if (dayClass.holiday) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800">
          Holiday ({dayClass.holiday.name})
        </span>
      );
    }
    if (dayClass.vacation) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
          Vacation ({dayClass.vacation.name})
        </span>
      );
    }
    if (dayClass.isWeeklyOff) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
          Weekly Off ({getDayName(dayClass.dayOfWeek)})
        </span>
      );
    }
    if (dayClass.exam && !dayClass.exam.isSchoolDay) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
          Exam (Non-School Day)
        </span>
      );
    }
    if (dayClass.personalLeave) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
          Personal Leave
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
        Working School Day
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isToday ? 'Today' : isPast ? 'Past Date' : 'Upcoming Date'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatDateString(dateStr, 'full')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day Status Overview */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Status Classification
            </span>
            {getStatusBadge()}
          </div>

          {/* List of reasons if multiple overlap */}
          {dayClass.reasons.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Calendar Details:
              </span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {dayClass.reasons.map((r, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Overlap rule notice */}
          {dayClass.isOff && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                This day is officially OFF. Adding a personal leave here will NOT reduce your official school day count.
              </span>
            </div>
          )}
        </div>

        {/* Actions for Past/Today Dates (Mark Attendance) */}
        {(isPast || isToday) && dayClass.isOfficialSchoolDay && (
          <div className="my-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Attendance Record
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleAttendance(dateStr, 'attended')}
                className={`py-2.5 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                  dayClass.attendance?.status === 'attended' || !dayClass.attendance
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Attended</span>
              </button>

              <button
                onClick={() => onToggleAttendance(dateStr, 'absent')}
                className={`py-2.5 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                  dayClass.attendance?.status === 'absent'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Absent / Leave</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Management Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          {!dayClass.personalLeave ? (
            <button
              onClick={() => {
                onClose();
                onAddLeaveForDate(dateStr);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-500" />
              <span>Mark Personal Leave for this Date</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onRemoveLeaveForDate(dayClass.personalLeave!.id);
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Remove Personal Leave</span>
            </button>
          )}

          {!dayClass.holiday && (
            <button
              onClick={() => {
                onClose();
                onAddHolidayForDate(dateStr);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Set as School Holiday / Festival</span>
            </button>
          )}

          {!dayClass.exam && (
            <button
              onClick={() => {
                onClose();
                onAddExamForDate(dateStr);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Mark Exam / Test Date</span>
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
};
