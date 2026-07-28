import React, { useEffect, useState } from 'react';
import {
  User,
  Calendar,
  Sparkles,
  Palmtree,
  BookOpen,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  Plus,
  Info,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  AppSettings,
  Exam,
  FullAppData,
  Holiday,
  SchoolAlarm,
  SchoolConfig,
  UserProfile,
  Vacation,
} from '../../types';
import { classifyDate } from '../../utils/calculator';
import { addDays, DAY_NAMES_SHORT, formatDateString, getTodayString } from '../../utils/dateUtils';
import { exportAppDataJSON, importAppDataJSON, loadSampleDemoData } from '../../utils/storage';

interface SettingsScreenProps {
  appData: FullAppData;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onUpdateConfig: (config: Partial<SchoolConfig>) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onToggleHoliday: (holidayId: string) => void;
  onRemoveHoliday: (holidayId: string) => void;
  onRemoveVacation: (vacationId: string) => void;
  onRemoveExam: (examId: string) => void;
  onToggleAlarm?: (alarmId: string) => void;
  onRemoveAlarm?: (alarmId: string) => void;
  onOpenHolidayModal: () => void;
  onOpenVacationModal: () => void;
  onOpenExamModal: () => void;
  onOpenAlarmModal?: () => void;
  onEditAlarm?: (alarm: SchoolAlarm) => void;
  onLoadSampleData: () => void;
  onResetApp: () => void;
  onImportAppData: (data: FullAppData) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  appData,
  onUpdateProfile,
  onUpdateConfig,
  onUpdateSettings,
  onToggleHoliday,
  onRemoveHoliday,
  onRemoveVacation,
  onRemoveExam,
  onToggleAlarm,
  onRemoveAlarm,
  onOpenHolidayModal,
  onOpenVacationModal,
  onOpenExamModal,
  onOpenAlarmModal,
  onEditAlarm,
  onLoadSampleData,
  onResetApp,
  onImportAppData,
}) => {
  const { profile, config, holidays, vacations, exams, settings } = appData;

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const toggleWeeklyOff = (dayIndex: number) => {
    let nextOffs = [...config.weeklyOffs];
    if (nextOffs.includes(dayIndex)) {
      if (nextOffs.length === 1) {
        alert('You must keep at least one weekly off.');
        return;
      }
      nextOffs = nextOffs.filter((d) => d !== dayIndex);
    } else {
      nextOffs.push(dayIndex);
    }
    onUpdateConfig({ weeklyOffs: nextOffs });
  };

  const handleExportJSON = () => {
    const jsonStr = exportAppDataJSON(appData);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schoolzero-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProcessImport = () => {
    try {
      if (!importJsonText.trim()) return;
      const imported = importAppDataJSON(importJsonText);
      onImportAppData(imported);
      setImportJsonText('');
      setShowImportArea(false);
      alert('SchoolZero backup imported successfully!');
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    }
  };

  const handleTestNotification = () => {
    if (!('Notification' in window)) {
      alert('Browser notification API is not supported in this browser window.');
      return;
    }

    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        new Notification('SchoolZero', {
          body: '87 school days left 🎒 Next off in 3 days!',
          icon: '/favicon.ico',
        });
        setNotificationMsg('Test notification sent successfully!');
      } else {
        alert('Notification permission was denied in your browser settings.');
      }
    });
  };

  return (
    <div className="space-y-5 pb-28 max-w-md mx-auto">
      {/* Settings Title */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          Settings & Schedule
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize your SchoolZero experience
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <User className="w-4 h-4 text-emerald-500" />
          <span>Profile</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={profile.name}
              placeholder="Name"
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Class / Grade
            </label>
            <input
              type="text"
              value={profile.userClass}
              placeholder="Class 10"
              onChange={(e) => onUpdateProfile({ userClass: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* School Calendar Schedule */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>School Schedule Configuration</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => onUpdateConfig({ startDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Date
            </label>
            <input
              type="date"
              value={config.targetDate}
              onChange={(e) => onUpdateConfig({ targetDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              School Starts At
            </label>
            <input
              type="time"
              value={config.schoolStartTime || '08:00'}
              onChange={(e) => onUpdateConfig({ schoolStartTime: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              School Ends At
            </label>
            <input
              type="time"
              value={config.schoolEndTime || '14:00'}
              onChange={(e) => onUpdateConfig({ schoolEndTime: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Weekly Off Days
          </label>
          <div className="grid grid-cols-7 gap-1">
            {DAY_NAMES_SHORT.map((dayName, idx) => {
              const isOff = config.weeklyOffs.includes(idx);
              return (
                <button
                  key={dayName}
                  type="button"
                  onClick={() => toggleWeeklyOff(idx)}
                  className={`h-9 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                    isOff
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {dayName[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Smart School Alarms Manager */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Smart School Alarms ({appData.alarms?.length || 0})</span>
          </h3>

          {onOpenAlarmModal && (
            <button
              onClick={onOpenAlarmModal}
              className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-800 dark:text-amber-300 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Alarm</span>
            </button>
          )}
        </div>

        {/* Intelligence Banner */}
        {(() => {
          const tomorrowStr = addDays(getTodayString(), 1);
          const tomorrowClass = classifyDate(
            tomorrowStr,
            appData.config,
            appData.holidays,
            appData.vacations,
            appData.personalLeaves,
            appData.exams,
            appData.attendance
          );
          if (tomorrowClass.isOff) {
            return (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Auto-Suppressed Tomorrow:</strong> Tomorrow is an off day (
                  {tomorrowClass.holiday
                    ? tomorrowClass.holiday.name
                    : tomorrowClass.vacation
                    ? tomorrowClass.vacation.name
                    : tomorrowClass.personalLeave
                    ? 'Personal Leave'
                    : 'Weekly Off'}
                  ). School alarms will not ring tomorrow.
                </span>
              </div>
            );
          }
          return null;
        })()}

        {/* Alarms List */}
        <div className="space-y-2">
          {(!appData.alarms || appData.alarms.length === 0) ? (
            <p className="text-xs text-slate-400 italic text-center py-2">
              No school alarms set. Tap "Add Alarm" above to configure.
            </p>
          ) : (
            appData.alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleAlarm && onToggleAlarm(alarm.id)}
                    className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                      alarm.enabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        alarm.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                        {alarm.time}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {alarm.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Snooze: {alarm.snoozeDurationMinutes}m · Sound: {alarm.soundEnabled ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {onEditAlarm && (
                    <button
                      onClick={() => onEditAlarm(alarm)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onRemoveAlarm && (
                    <button
                      onClick={() => onRemoveAlarm(alarm.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manage Holidays */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>School Holidays ({holidays.length})</span>
          </h3>

          <button
            onClick={onOpenHolidayModal}
            className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-300 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Holiday</span>
          </button>
        </div>

        {holidays.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No custom holidays added yet.</p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={h.enabled}
                    onChange={() => onToggleHoliday(h.id)}
                    className="accent-emerald-600 cursor-pointer w-4 h-4 rounded"
                  />
                  <div>
                    <span
                      className={`font-semibold block ${
                        h.enabled ? 'text-slate-800 dark:text-slate-200' : 'line-through text-slate-400'
                      }`}
                    >
                      {h.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {formatDateString(h.date, 'month_day')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveHoliday(h.id)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manage Vacations */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Palmtree className="w-4 h-4 text-purple-500" />
            <span>Vacation Ranges ({vacations.length})</span>
          </h3>

          <button
            onClick={onOpenVacationModal}
            className="px-2.5 py-1 bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 text-purple-700 dark:text-purple-300 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vacation</span>
          </button>
        </div>

        {vacations.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No vacation ranges configured.</p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {vacations.map((v) => (
              <div
                key={v.id}
                className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    {v.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formatDateString(v.startDate, 'month_day')} → {formatDateString(v.endDate, 'month_day')}
                  </span>
                </div>

                <button
                  onClick={() => onRemoveVacation(v.id)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Notifications</span>
          </h3>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) =>
                onUpdateSettings({ enableNotifications: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
          </label>
        </div>

        {settings.enableNotifications && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Daily Notification Time
              </span>
              <input
                type="time"
                value={settings.dailyNotificationTime}
                onChange={(e) =>
                  onUpdateSettings({ dailyNotificationTime: e.target.value })
                }
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
              />
            </div>

            <button
              onClick={handleTestNotification}
              className="w-full py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Send Sample Local Notification</span>
            </button>
            {notificationMsg && (
              <p className="text-[10px] text-emerald-600 text-center font-medium">
                {notificationMsg}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Backup, Export & Import */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Download className="w-4 h-4 text-blue-500" />
          <span>Data Backup & Presets</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportJSON}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4 text-blue-500" />
            <span>Import JSON</span>
          </button>
        </div>

        {showImportArea && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
            <textarea
              rows={3}
              placeholder="Paste SchoolZero JSON backup text here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-hidden"
            />
            <button
              onClick={handleProcessImport}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
            >
              Verify & Restore Data
            </button>
          </div>
        )}

        <button
          onClick={onLoadSampleData}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
          <span>Load Sample Academic Preset (2026-2028)</span>
        </button>
      </div>

      {/* Reset SchoolZero */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Reset SchoolZero</span>
        </h3>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-xs rounded-xl transition-colors"
          >
            Reset All Saved Data
          </button>
        ) : (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-2">
            <p className="text-xs text-rose-900 dark:text-rose-200 font-medium">
              Are you sure? This will permanently delete all your custom calendar entries, leaves, and configurations.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-1/2 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={onResetApp}
                className="w-1/2 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* About App */}
      <div className="text-center py-4 space-y-1 text-slate-400 text-xs">
        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>SchoolZero v1.0</span>
        </div>
        <p className="text-[10px]">School days. Down to zero.</p>
        <p className="text-[10px] text-slate-500">100% Offline & Private local data</p>
      </div>
    </div>
  );
};
