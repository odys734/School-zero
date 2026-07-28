import React, { useEffect, useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { CalculationResult, SchoolConfig } from '../../types';
import { parseLocalDate, formatDateString } from '../../utils/dateUtils';

interface LiveCountdownProps {
  config: SchoolConfig;
  calcResult: CalculationResult;
  targetType: 'final' | 'next_off' | 'next_holiday' | 'next_vacation';
  onChangeTargetType: (target: 'final' | 'next_off' | 'next_holiday' | 'next_vacation') => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
}

export const LiveCountdown: React.FC<LiveCountdownProps> = ({
  config,
  calcResult,
  targetType,
  onChangeTargetType,
}) => {
  const [time, setTime] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0, label: '' });

  useEffect(() => {
    const updateTicker = () => {
      let targetDateStr = config.targetDate;
      let timeStr = config.targetTime || '08:00';
      let label = 'Final Target';

      if (targetType === 'next_off' && calcResult.nextOff) {
        targetDateStr = calcResult.nextOff.date;
        label = calcResult.nextOff.title;
      } else if (targetType === 'next_holiday' && calcResult.nextHoliday) {
        targetDateStr = calcResult.nextHoliday.date;
        label = calcResult.nextHoliday.title;
      } else if (targetType === 'next_vacation' && calcResult.nextVacation) {
        targetDateStr = calcResult.nextVacation.startDate;
        label = calcResult.nextVacation.name;
      } else {
        label = `Target: ${formatDateString(config.targetDate, 'short')}`;
      }

      const [hours, minutes] = timeStr.split(':').map((n) => parseInt(n, 10) || 0);
      const targetDateObj = parseLocalDate(targetDateStr);
      targetDateObj.setHours(hours, minutes, 0, 0);

      const now = new Date();
      const diffMs = targetDateObj.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, label });
        return;
      }

      const totalSecs = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSecs / (3600 * 24));
      const remHours = Math.floor((totalSecs % (3600 * 24)) / 3600);
      const remMins = Math.floor((totalSecs % 3600) / 60);
      const remSecs = totalSecs % 60;

      setTime({
        days,
        hours: remHours,
        minutes: remMins,
        seconds: remSecs,
        label,
      });
    };

    updateTicker();
    const timer = setInterval(updateTicker, 1000);
    return () => clearInterval(timer);
  }, [config.targetDate, config.targetTime, targetType, calcResult]);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Live Chronological Countdown</span>
        </div>

        <select
          value={targetType}
          onChange={(e) => onChangeTargetType(e.target.value as any)}
          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1 border-0 focus:ring-1 focus:ring-indigo-500 cursor-pointer font-medium"
        >
          <option value="final">Final Target</option>
          {calcResult.nextOff && <option value="next_off">Next Off</option>}
          {calcResult.nextHoliday && <option value="next_holiday">Next Holiday</option>}
          {calcResult.nextVacation && <option value="next_vacation">Next Vacation</option>}
        </select>
      </div>

      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2.5 truncate">
        {time.label}
      </p>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2 border border-slate-100 dark:border-slate-700/50">
          <span className="block text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {time.days}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">
            Days
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2 border border-slate-100 dark:border-slate-700/50">
          <span className="block text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {String(time.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">
            Hours
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2 border border-slate-100 dark:border-slate-700/50">
          <span className="block text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {String(time.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">
            Mins
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2 border border-slate-100 dark:border-slate-700/50">
          <span className="block text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {String(time.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">
            Secs
          </span>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
        Notice: Live timer measures real 24h clock time. "School Days Left" excludes holidays.
      </p>
    </div>
  );
};
