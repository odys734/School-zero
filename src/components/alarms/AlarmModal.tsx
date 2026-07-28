import React, { useState } from 'react';
import { X, Bell, Volume2, Check, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { SchoolAlarm } from '../../types';
import { DAY_NAMES_SHORT } from '../../utils/dateUtils';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alarm: Omit<SchoolAlarm, 'id'>) => void;
  initialAlarm?: SchoolAlarm;
}

export function playChimeSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(523.25, now, 0.35); // C5
    playTone(659.25, now + 0.15, 0.35); // E5
    playTone(783.99, now + 0.3, 0.6); // G5
  } catch (e) {
    console.warn('Audio play prevented or unavailable:', e);
  }
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAlarm,
}) => {
  const [title, setTitle] = useState(initialAlarm?.title || 'Wake Up for School');
  const [time, setTime] = useState(initialAlarm?.time || '06:30');
  const [enabled, setEnabled] = useState(initialAlarm?.enabled ?? true);
  const [snoozeDurationMinutes, setSnoozeDurationMinutes] = useState<number>(
    initialAlarm?.snoozeDurationMinutes || 5
  );
  const [soundEnabled, setSoundEnabled] = useState(initialAlarm?.soundEnabled ?? true);
  const [vibrationEnabled, setVibrationEnabled] = useState(
    initialAlarm?.vibrationEnabled ?? true
  );
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initialAlarm?.daysOfWeek || [1, 2, 3, 4, 5, 6]
  );

  if (!isOpen) return null;

  const toggleDay = (dayIndex: number) => {
    if (daysOfWeek.includes(dayIndex)) {
      if (daysOfWeek.length === 1) {
        alert('Alarm must be active on at least one day.');
        return;
      }
      setDaysOfWeek(daysOfWeek.filter((d) => d !== dayIndex));
    } else {
      setDaysOfWeek([...daysOfWeek, dayIndex]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an alarm title.');
      return;
    }
    onSave({
      title: title.trim(),
      time,
      enabled,
      snoozeDurationMinutes,
      soundEnabled,
      vibrationEnabled,
      daysOfWeek,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {initialAlarm ? 'Edit School Alarm' : 'New School Alarm'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auto-suppresses on holidays & vacations
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

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alarm Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wake Up, Get Ready, Leave Home"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alarm Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-mono focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Snooze Duration
              </label>
              <select
                value={snoozeDurationMinutes}
                onChange={(e) => setSnoozeDurationMinutes(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden cursor-pointer"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Active Days
            </label>
            <div className="grid grid-cols-7 gap-1">
              {DAY_NAMES_SHORT.map((dayName, idx) => {
                const isActive = daysOfWeek.includes(idx);
                return (
                  <button
                    key={dayName}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`h-9 rounded-xl text-xs font-bold border transition-all ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {dayName[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Play Audio Sound
              </span>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  soundEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {soundEnabled && (
              <button
                type="button"
                onClick={playChimeSound}
                className="w-full py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-amber-200 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Alarm Chime Tone</span>
              </button>
            )}
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed">
              <strong>SchoolZero Intelligence:</strong> This alarm automatically silences if tomorrow or today is classified as a Weekly Off, Holiday, Vacation, or Planned Leave!
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              Save Alarm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
