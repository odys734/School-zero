import React from 'react';
import { X, Calculator, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { CalculationResult } from '../../types';
import { formatDateString } from '../../utils/dateUtils';

interface BreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  calcResult: CalculationResult;
}

export const BreakdownModal: React.FC<BreakdownModalProps> = ({
  isOpen,
  onClose,
  calcResult,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Calculation Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How SchoolZero calculates your exact days
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculation Formula Steps */}
        <div className="py-4 space-y-3">
          {/* Step 1: Total Calendar Days */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Total Calendar Days
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  From {formatDateString(calcResult.todayDate, 'month_day')} to {formatDateString(calcResult.targetDate, 'medium')}
                </span>
              </div>
            </div>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
              {calcResult.totalCalendarDays}
            </span>
          </div>

          {/* Deductions */}
          <div className="space-y-1.5 pl-3 border-l-2 border-emerald-500/40 my-2">
            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                − Weekly Offs
              </span>
              <span className="font-mono font-medium text-rose-500">
                −{calcResult.officialWeeklyOffsCount}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                − Official Holidays (working days)
              </span>
              <span className="font-mono font-medium text-rose-500">
                −{calcResult.officialHolidaysCount}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                − Vacation School Days
              </span>
              <span className="font-mono font-medium text-rose-500">
                −{calcResult.officialVacationSchoolDaysCount}
              </span>
            </div>
          </div>

          {/* Result 1: Official School Days Left */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                Official School Days Left
              </span>
              <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                Mandatory scheduled school days remaining
              </span>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {calcResult.officialSchoolDaysLeft}
            </span>
          </div>

          {/* Personal Leaves adjustment */}
          <div className="pl-3 border-l-2 border-amber-500/40 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                − Planned Personal Leaves (on school days)
              </span>
              <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
                −{calcResult.plannedPersonalLeavesCount}
              </span>
            </div>
          </div>

          {/* Result 2: Estimated Attendance Days */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                Estimated Attendance Days Left
              </span>
              <span className="text-[11px] text-amber-800/80 dark:text-amber-400">
                Days you will actually attend after personal leaves
              </span>
            </div>
            <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {calcResult.estimatedDaysWillAttend}
            </span>
          </div>
        </div>

        {/* Strict Overlap Rule Callout */}
        <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-200">Zero Overlap Guarantee:</strong> SchoolZero classifies each date individually. A Sunday inside a vacation or holiday is deducted only once, never double-counted!
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
