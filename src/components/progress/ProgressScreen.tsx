import React from 'react';
import {
  BarChart3,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Palmtree,
  UserMinus,
  Calculator,
  Percent,
} from 'lucide-react';
import { CalculationResult, SchoolConfig } from '../../types';
import { formatDateString } from '../../utils/dateUtils';

interface ProgressScreenProps {
  calcResult: CalculationResult;
  config: SchoolConfig;
  onOpenBreakdown: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  calcResult,
  config,
  onOpenBreakdown,
}) => {
  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      {/* Header Overview */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Progress & Stats
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Journey metrics & milestones
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBreakdown}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-500" />
            <span>Formula</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-700 dark:text-slate-300">
              Overall Journey Completion
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              {calcResult.progressPercentage}%
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${calcResult.progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
            <span>Start: {formatDateString(config.startDate, 'month_day')}</span>
            <span>Target: {formatDateString(config.targetDate, 'month_day')}</span>
          </div>
        </div>
      </div>

      {/* Grid Stats Matrix */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            School Days Left
          </span>
          <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {calcResult.officialSchoolDaysLeft}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Official scheduled days
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            School Days Done
          </span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {calcResult.officialSchoolDaysCompleted}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Out of {calcResult.totalOfficialSchoolDays} total
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Calendar Days Left
          </span>
          <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">
            {calcResult.totalCalendarDays}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Includes weekends & off
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Estimated Attendance
          </span>
          <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {calcResult.estimatedDaysWillAttend}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Minus planned leaves
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Holidays Left
          </span>
          <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {calcResult.officialHolidaysCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Festivals on school days
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Vacation Days
          </span>
          <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
            {calcResult.officialVacationSchoolDaysCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            On working school dates
          </span>
        </div>
      </div>

      {/* Milestones Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Countdown Milestones</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {calcResult.milestones.map((m) => (
            <div
              key={m.targetValue}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                m.reached
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/80'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-700/50 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 block">
                  {m.targetValue === 0 ? 'ZERO DAY' : `${m.targetValue} Days`}
                </span>
                <span className="text-[10px] text-slate-500">
                  {m.reached ? 'Reached!' : 'Pending'}
                </span>
              </div>

              {m.reached ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
