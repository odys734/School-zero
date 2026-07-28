import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  Palmtree,
  UserMinus,
  BookOpen,
  Filter,
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
import {
  CalendarDayItem,
  DAY_NAMES_SHORT,
  formatDateString,
  getCalendarMonthGrid,
  getTodayString,
} from '../../utils/dateUtils';
import { DayDetailsModal } from './DayDetailsModal';

interface CalendarScreenProps {
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

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
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
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-11
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<
    'all' | 'holidays' | 'vacations' | 'leaves' | 'exams'
  >('all');

  const monthGrid = getCalendarMonthGrid(currentYear, currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      {/* Calendar Header Controls */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{monthNames[currentMonth]}</span>
              <span className="text-slate-400 font-normal">{currentYear}</span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleJumpToToday}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-full font-medium shrink-0 transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Days
          </button>
          <button
            onClick={() => setFilterType('holidays')}
            className={`px-2.5 py-1 rounded-full font-medium shrink-0 transition-colors ${
              filterType === 'holidays'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            Holidays ({holidays.filter((h) => h.enabled).length})
          </button>
          <button
            onClick={() => setFilterType('vacations')}
            className={`px-2.5 py-1 rounded-full font-medium shrink-0 transition-colors ${
              filterType === 'vacations'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
            }`}
          >
            Vacations ({vacations.length})
          </button>
          <button
            onClick={() => setFilterType('leaves')}
            className={`px-2.5 py-1 rounded-full font-medium shrink-0 transition-colors ${
              filterType === 'leaves'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            Leaves ({personalLeaves.length})
          </button>
          <button
            onClick={() => setFilterType('exams')}
            className={`px-2.5 py-1 rounded-full font-medium shrink-0 transition-colors ${
              filterType === 'exams'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
            }`}
          >
            Exams ({exams.length})
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mt-4 text-center">
          {DAY_NAMES_SHORT.map((dayName, idx) => {
            const isWeeklyOffHeader = config.weeklyOffs.includes(idx);
            return (
              <div
                key={dayName}
                className={`text-[11px] font-bold py-1 ${
                  isWeeklyOffHeader
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {dayName}
              </div>
            );
          })}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 mt-1">
          {monthGrid.map((item) => {
            const dayClass = classifyDate(
              item.dateStr,
              config,
              holidays,
              vacations,
              personalLeaves,
              exams,
              attendance
            );

            // Filter logic
            let isDimmedByFilter = false;
            if (filterType === 'holidays' && !dayClass.holiday) isDimmedByFilter = true;
            if (filterType === 'vacations' && !dayClass.vacation) isDimmedByFilter = true;
            if (filterType === 'leaves' && !dayClass.personalLeave) isDimmedByFilter = true;
            if (filterType === 'exams' && !dayClass.exam) isDimmedByFilter = true;

            // Styling variables
            let cellStyle = 'bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200';
            let dotColor: string | null = null;

            if (dayClass.holiday) {
              cellStyle = 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold border border-rose-300 dark:border-rose-800';
              dotColor = 'bg-rose-500';
            } else if (dayClass.vacation) {
              cellStyle = 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-bold border border-purple-300 dark:border-purple-800';
              dotColor = 'bg-purple-500';
            } else if (dayClass.isWeeklyOff) {
              cellStyle = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 font-semibold';
              dotColor = 'bg-indigo-400';
            } else if (dayClass.personalLeave) {
              cellStyle = 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800';
              dotColor = 'bg-amber-500';
            } else if (dayClass.exam) {
              cellStyle = 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold border border-blue-300 dark:border-blue-800';
              dotColor = 'bg-blue-500';
            }

            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`relative h-12 rounded-xl flex flex-col items-center justify-between p-1 transition-all ${cellStyle} ${
                  !item.isCurrentMonth ? 'opacity-30' : ''
                } ${isDimmedByFilter ? 'opacity-20 grayscale' : ''} ${
                  item.isToday
                    ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-800 font-black scale-105 z-10'
                    : ''
                }`}
              >
                <span className="text-xs font-mono">{item.dayOfMonth}</span>

                {/* Indicators */}
                <div className="flex items-center gap-0.5 mb-0.5">
                  {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                  {dayClass.holiday && <Sparkles className="w-2.5 h-2.5 text-rose-600 shrink-0" />}
                  {dayClass.vacation && <Palmtree className="w-2.5 h-2.5 text-purple-600 shrink-0" />}
                  {dayClass.exam && <BookOpen className="w-2.5 h-2.5 text-blue-600 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>School Day</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Weekly Off</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Vacation</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Leave</span>
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      <DayDetailsModal
        dateStr={selectedDateStr}
        onClose={() => setSelectedDateStr(null)}
        config={config}
        holidays={holidays}
        vacations={vacations}
        personalLeaves={personalLeaves}
        exams={exams}
        attendance={attendance}
        onToggleAttendance={onToggleAttendance}
        onAddLeaveForDate={onAddLeaveForDate}
        onRemoveLeaveForDate={onRemoveLeaveForDate}
        onAddHolidayForDate={onAddHolidayForDate}
        onAddExamForDate={onAddExamForDate}
      />
    </div>
  );
};
