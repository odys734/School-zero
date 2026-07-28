import React from 'react';
import { Home, Calendar, Palmtree, BarChart3, Settings } from 'lucide-react';

export type NavTab = 'home' | 'calendar' | 'leaves' | 'progress' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingLeavesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingLeavesCount = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'calendar' as NavTab, label: 'Calendar', icon: Calendar },
    { id: 'leaves' as NavTab, label: 'Leaves', icon: Palmtree, badge: pendingLeavesCount },
    { id: 'progress' as NavTab, label: 'Progress', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 transition-colors duration-200">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {!!tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
