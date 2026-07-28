import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { PersonalLeave } from '../../types';
import { getTodayString } from '../../utils/dateUtils';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leave: Omit<PersonalLeave, 'id'>) => void;
  initialDate?: string;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
}) => {
  const [date, setDate] = useState(initialDate || getTodayString());
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'planned' | 'taken'>('planned');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    onSave({
      date,
      reason: reason.trim() || 'Personal Leave',
      status,
    });
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Plan Personal Leave
              </h3>
              <p className="text-xs text-slate-500">Record your planned or taken absence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Leave Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reason / Occasion
            </label>
            <input
              type="text"
              placeholder="e.g., Family Function, Sick Leave, Doctor Appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('planned')}
                className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-colors ${
                  status === 'planned'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Planned (Future)
              </button>
              <button
                type="button"
                onClick={() => setStatus('taken')}
                className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-colors ${
                  status === 'taken'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Taken (Past)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              Save Leave
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
