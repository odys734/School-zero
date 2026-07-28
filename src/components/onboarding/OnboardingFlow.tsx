import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Check,
  User,
  Sliders,
  Zap,
} from 'lucide-react';
import { FullAppData, SchoolConfig, UserProfile } from '../../types';
import { DAY_NAMES_SHORT, getTodayString } from '../../utils/dateUtils';
import { SAMPLE_DEMO_DATA } from '../../utils/sampleData';

interface OnboardingFlowProps {
  onCompleteOnboarding: (data: FullAppData) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onCompleteOnboarding,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Profile state
  const [name, setName] = useState('');
  const [userClass, setUserClass] = useState('');

  // Schedule setup state
  const todayStr = getTodayString();
  const defaultTargetStr = `${new Date().getFullYear() + 1}-03-31`;

  const [startDate, setStartDate] = useState(todayStr);
  const [targetDate, setTargetDate] = useState(defaultTargetStr);
  const [targetTime, setTargetTime] = useState('08:00');
  const [weeklyOffs, setWeeklyOffs] = useState<number[]>([0]); // Sunday by default

  const classOptions = ['6', '7', '8', '9', '10', '11', '12', 'College', 'Other'];

  const toggleWeeklyOff = (dayIndex: number) => {
    if (weeklyOffs.includes(dayIndex)) {
      if (weeklyOffs.length === 1) {
        alert('You must keep at least one weekly off day.');
        return;
      }
      setWeeklyOffs(weeklyOffs.filter((d) => d !== dayIndex));
    } else {
      setWeeklyOffs([...weeklyOffs, dayIndex]);
    }
  };

  const handleFinish = (usePreset: boolean) => {
    if (targetDate <= startDate) {
      alert('Target date must be after the start date.');
      return;
    }

    const config: SchoolConfig = {
      startDate,
      targetDate,
      targetTime,
      weeklyOffs,
    };

    const profile: UserProfile = {
      name: name.trim(),
      userClass: userClass.trim(),
    };

    let baseData: FullAppData;
    if (usePreset) {
      baseData = {
        ...SAMPLE_DEMO_DATA,
        profile,
        config,
        settings: {
          ...SAMPLE_DEMO_DATA.settings,
          hasCompletedOnboarding: true,
        },
      };
    } else {
      baseData = {
        version: 1,
        profile,
        config,
        holidays: [],
        vacations: [],
        personalLeaves: [],
        exams: [],
        attendance: [],
        settings: {
          primaryCountdownMode: 'official',
          showLiveCountdown: true,
          liveCountdownTarget: 'final',
          leaveForecastPerMonth: 0,
          enableNotifications: false,
          dailyNotificationTime: '07:30',
          notificationCategories: {
            dailyCountdown: true,
            holidayReminder: true,
            vacationReminder: true,
            milestones: true,
            zeroDay: true,
          },
          theme: 'system',
          hasCompletedOnboarding: true,
        },
      };
    }

    onCompleteOnboarding(baseData);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-800/90 rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden my-auto animate-in fade-in duration-200">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-6 bg-emerald-500'
                  : s < step
                  ? 'w-1.5 bg-emerald-700'
                  : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <Zap className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                SchoolZero
              </h1>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mt-1">
                Count your school days down to zero
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Calculates how many days you actually need to attend school before your target date by excluding weekly offs, holidays, vacations, and personal leaves.
            </p>

            <div className="pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-400 mt-2">
                No account required · Works 100% offline · Private data
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: OPTIONAL PROFILE */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Step 1 of 3
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                What should we call you?
              </h2>
              <p className="text-xs text-slate-400">
                Optional personalization for greetings
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Toyesh (or leave blank)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Class / Grade
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {classOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setUserClass(c === userClass ? '' : c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      userClass === c
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {c === 'Other' || c === 'College' ? c : `Class ${c}`}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or custom class name..."
                value={userClass}
                onChange={(e) => setUserClass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs rounded-xl"
              >
                Skip Profile
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ESSENTIAL SCHOOL SETUP */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Step 2 of 3
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                School Schedule
              </h2>
              <p className="text-xs text-slate-400">
                Required dates to run calculations
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Weekly Off Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Weekly Off Days (Select all that apply)
              </label>
              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES_SHORT.map((dayName, idx) => {
                  const isSelected = weeklyOffs.includes(idx);
                  return (
                    <button
                      key={dayName}
                      type="button"
                      onClick={() => toggleWeeklyOff(idx)}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {dayName[0]}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Selected off days will automatically be excluded from school day counts.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep(4)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PRESET CHOICE */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Step 3 of 3
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Load Initial Calendar?
              </h2>
              <p className="text-xs text-slate-400">
                Choose how you want to start SchoolZero
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleFinish(true)}
                className="w-full p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-left transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Load Sample Academic Preset</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Includes sample Indian/CBSE school festivals (Diwali, Dussehra, Independence Day) & vacations so you see immediate full calculations.
                </p>
              </button>

              <button
                onClick={() => handleFinish(false)}
                className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-900/80 border border-slate-700 text-left transition-all"
              >
                <span className="text-xs font-bold text-white block mb-1">
                  Start Fresh / Blank Calendar
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Start with zero holidays and vacations. You can manually enter your own school schedule.
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
