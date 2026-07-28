import React, { useEffect } from 'react';
import { Bell, Clock, Volume2, X } from 'lucide-react';
import { SchoolAlarm } from '../../types';
import { playChimeSound } from './AlarmModal';

interface RingingAlarmBannerProps {
  alarm: SchoolAlarm;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

export const RingingAlarmBanner: React.FC<RingingAlarmBannerProps> = ({
  alarm,
  onDismiss,
  onSnooze,
}) => {
  useEffect(() => {
    if (alarm.soundEnabled) {
      playChimeSound();
      const timer = setInterval(playChimeSound, 4000); // chime every 4s
      return () => clearInterval(timer);
    }
  }, [alarm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 animate-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl border-2 border-amber-500 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-amber-500/30">
          <Bell className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            School Alarm Triggered
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {alarm.title}
          </h2>
          <span className="text-lg font-bold font-mono text-amber-600 block mt-0.5">
            {alarm.time}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          It's time for your scheduled school routine!
        </p>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => onSnooze(alarm.snoozeDurationMinutes || 5)}
            className="w-full py-3 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Snooze ({alarm.snoozeDurationMinutes || 5} min)</span>
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Dismiss Alarm
          </button>
        </div>
      </div>
    </div>
  );
};
