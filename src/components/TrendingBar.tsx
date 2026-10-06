import React from 'react';
import { Flame } from 'lucide-react';
import { TRENDING_TAGS } from '../data/newsData';

interface TrendingBarProps {
  onSelectTag: (tag: string) => void;
  activeTag: string | null;
}

export const TrendingBar: React.FC<TrendingBarProps> = ({ onSelectTag, activeTag }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0 mr-1">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-400 animate-bounce" />
          <span>Topik Populer:</span>
        </div>
        
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {TRENDING_TAGS.map((tag) => {
            const isSelected = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? '' : tag)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#004a99] text-amber-300 border border-amber-400 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 hover:text-slate-900 dark:hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
