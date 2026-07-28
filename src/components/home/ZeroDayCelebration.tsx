import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { CalculationResult, SchoolConfig } from '../../types';
import { formatDateString } from '../../utils/dateUtils';

interface ZeroDayCelebrationProps {
  calcResult: CalculationResult;
  config: SchoolConfig;
  onChangeTargetClick: () => void;
  onViewJourneyClick: () => void;
  onNewCountdownClick: () => void;
}

export const ZeroDayCelebration: React.FC<ZeroDayCelebrationProps> = ({
  calcResult,
  config,
  onChangeTargetClick,
  onViewJourneyClick,
  onNewCountdownClick,
}) => {
  useEffect(() => {
    // Fire confetti sequence
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);
      return () => clearTimeout(timer);
    } catch (e) {
      // Graceful fallback if confetti fails
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 rounded-3xl p-6 border-2 border-emerald-500/30 text-center shadow-xl animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
        <Award className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        Target Reached!
      </span>

      <h2 className="text-6xl font-black font-mono text-slate-900 dark:text-slate-100 my-2 tracking-tight">
        0
      </h2>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
        <Sparkles className="w-5 h-5 text-amber-500 inline" />
        <span>YOU MADE IT</span>
      </h3>

      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">
        You have successfully completed all scheduled school days up to{' '}
        <strong className="text-slate-800 dark:text-slate-200">
          {formatDateString(config.targetDate, 'medium')}
        </strong>
        .
      </p>

      {/* Stats Summary Pill */}
      <div className="my-6 p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 max-w-xs mx-auto grid grid-cols-2 gap-3 text-left">
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
            Total School Days
          </span>
          <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
            {calcResult.totalOfficialSchoolDays}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
            Completed
          </span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
            100%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 max-w-xs mx-auto">
        <button
          onClick={onChangeTargetClick}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Set Next Target Date</span>
        </button>

        <button
          onClick={onViewJourneyClick}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>View Journey Stats</span>
        </button>

        <button
          onClick={onNewCountdownClick}
          className="w-full py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-xs flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Start New Countdown Setup</span>
        </button>
      </div>
    </div>
  );
};
