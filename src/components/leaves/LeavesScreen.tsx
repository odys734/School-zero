import React, { useState } from 'react';
import {
  Palmtree,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  Sliders,
} from 'lucide-react';
import { AppSettings, PersonalLeave, SchoolConfig } from '../../types';
import { classifyDate } from '../../utils/calculator';
import { formatDateString, getTodayString } from '../../utils/dateUtils';

interface LeavesScreenProps {
  personalLeaves: PersonalLeave[];
  config: SchoolConfig;
  settings: AppSettings;
  onOpenAddLeaveModal: () => void;
  onRemoveLeave: (id: string) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const LeavesScreen: React.FC<LeavesScreenProps> = ({
  personalLeaves,
  config,
  settings,
  onOpenAddLeaveModal,
  onRemoveLeave,
  onUpdateSettings,
}) => {
  const todayStr = getTodayString();
  const currentMonthPrefix = todayStr.substring(0, 7); // YYYY-MM

  const plannedLeaves = personalLeaves
    .filter((l) => l.date >= todayStr || l.status === 'planned')
    .sort((a, b) => a.date.localeCompare(b.date));

  const takenLeaves = personalLeaves
    .filter((l) => l.date < todayStr && l.status === 'taken')
    .sort((a, b) => b.date.localeCompare(a.date));

  const currentMonthLeaves = personalLeaves.filter((l) =>
    l.date.startsWith(currentMonthPrefix)
  );

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      {/* Overview Stats Header */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Personal Leaves
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your planned absences
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAddLeaveModal}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Leave</span>
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              This Month
            </span>
            <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
              {currentMonthLeaves.length}
            </span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-2xl border border-amber-200/60 dark:border-amber-800/60">
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block">
              Planned
            </span>
            <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
              {plannedLeaves.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Taken
            </span>
            <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
              {takenLeaves.length}
            </span>
          </div>
        </div>
      </div>

      {/* Optional Leave Forecast Setting Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Monthly Leave Forecast
            </span>
          </div>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">
            Optional
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
          Estimate average leaves per month for long-term projection. Never mixed into factual school days.
        </p>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={8}
            step={1}
            value={settings.leaveForecastPerMonth}
            onChange={(e) =>
              onUpdateSettings({
                leaveForecastPerMonth: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <span className="text-xs font-bold font-mono px-2 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg shrink-0">
            {settings.leaveForecastPerMonth > 0
              ? `~${settings.leaveForecastPerMonth}/mo`
              : 'Off'}
          </span>
        </div>
      </div>

      {/* Planned Leaves Section */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Upcoming / Planned Leaves ({plannedLeaves.length})
        </h3>

        {plannedLeaves.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Palmtree className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No planned personal leaves
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Planning leaves helps calculate your estimated attendance.
            </p>
            <button
              onClick={onOpenAddLeaveModal}
              className="mt-3 px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-xl hover:bg-amber-500 transition-colors inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Leave</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {plannedLeaves.map((leave) => (
              <div
                key={leave.id}
                className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-xl">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {formatDateString(leave.date, 'full')}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {leave.reason || 'Personal Leave'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveLeave(leave.id)}
                  title="Remove Leave"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Taken Leaves History */}
      {takenLeaves.length > 0 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Past Taken Leaves ({takenLeaves.length})
          </h3>

          <div className="space-y-2">
            {takenLeaves.map((leave) => (
              <div
                key={leave.id}
                className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between opacity-80"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    {formatDateString(leave.date, 'medium')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {leave.reason || 'Leave taken'}
                  </span>
                </div>

                <button
                  onClick={() => onRemoveLeave(leave.id)}
                  className="p-1 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
