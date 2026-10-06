import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import { POPULAR_ARTICLES } from '../data/newsData';

interface PopularRankingListProps {
  onSelectArticleTitle: (title: string) => void;
}

export const PopularRankingList: React.FC<PopularRankingListProps> = ({ onSelectArticleTitle }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Terpopuler di Arun News
          </h2>
        </div>
        <span className="text-[11px] font-medium text-slate-400">24 Jam Terakhir</span>
      </div>

      <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
        {POPULAR_ARTICLES.map((item) => {
          const isTopThree = item.rank <= 3;
          return (
            <div
              key={item.id + item.rank}
              onClick={() => onSelectArticleTitle(item.title)}
              className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5 group cursor-pointer"
            >
              {/* Ranking Number */}
              <div 
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 tabular-nums ${
                  isTopThree
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-blue-50 dark:bg-slate-800 text-[#004a99] dark:text-blue-300 font-bold'
                }`}
              >
                {item.rank}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mb-1">
                  <span className="font-semibold text-blue-700 dark:text-amber-400">
                    {item.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono">{item.views}</span>
                </div>
                <h4 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
