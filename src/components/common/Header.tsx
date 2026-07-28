import React from 'react';
import { UserProfile, AppSettings } from '../../types';
import { Sun, Moon, Sparkles, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenSettings: () => void;
  onOpenBreakdown?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenBreakdown,
}) => {
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17) timeGreeting = 'Good evening';

    if (profile.name.trim()) {
      return `${timeGreeting}, ${profile.name.trim()}`;
    }
    return timeGreeting;
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 transition-colors duration-200">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: App Title & Greeting */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SchoolZero
            </h1>
            {profile.userClass && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {profile.userClass}
              </span>
            )}
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            {getGreeting()}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {onOpenBreakdown && (
            <button
              onClick={onOpenBreakdown}
              title="Calculation Breakdown"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>
          )}

          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
