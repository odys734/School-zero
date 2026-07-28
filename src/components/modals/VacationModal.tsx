import React, { useState } from 'react';
import { X, Palmtree } from 'lucide-react';
import { Vacation, VacationCategory } from '../../types';
import { addDays, getTodayString } from '../../utils/dateUtils';

interface VacationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vacation: Omit<Vacation, 'id'>) => void;
}

export const VacationModal: React.FC<VacationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const today = getTodayString();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addDays(today, 7));
  const [category, setCategory] = useState<VacationCategory>('summer');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;
    if (endDate < startDate) {
      alert('Vacation end date cannot be earlier than start date.');
      return;
    }
    onSave({
      name: name.trim(),
      startDate,
      endDate,
      category,
      notes: notes.trim() || undefined,
    });
    setName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add Vacation Range
              </h3>
              <p className="text-xs text-slate-500">Multi-day school break</p>
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
              Vacation Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Summer Vacation, Diwali Break, Winter Break"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VacationCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 outline-hidden cursor-pointer"
            >
              <option value="summer">Summer Vacation</option>
              <option value="winter">Winter Vacation</option>
              <option value="diwali">Diwali Vacation</option>
              <option value="spring">Spring Break</option>
              <option value="exam">Exam Break</option>
              <option value="session">Session Break</option>
              <option value="custom">Custom Vacation</option>
            </select>
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
              className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              Save Vacation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
