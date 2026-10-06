import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { BREAKING_NEWS_ITEMS } from '../data/newsData';

interface BreakingNewsTickerProps {
  onSelectHeadline: (headline: string) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({ onSelectHeadline }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BREAKING_NEWS_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentItem = BREAKING_NEWS_ITEMS[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + BREAKING_NEWS_ITEMS.length) % BREAKING_NEWS_ITEMS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % BREAKING_NEWS_ITEMS.length);
  };

  return (
    <div className="bg-amber-50/90 dark:bg-slate-900 border-b border-amber-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left: Animated Breaking Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-[#004a99] text-amber-300 border border-amber-400/60 font-black text-[11px] sm:text-xs tracking-wider px-2.5 py-0.5 rounded flex items-center gap-1.5 shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-amber-300 animate-pulse" />
            <span>BREAKING NEWS</span>
          </span>
          <span className="hidden sm:inline text-[#004a99] dark:text-amber-400 text-xs font-bold">
            {currentItem.time}
          </span>
        </div>

        {/* Center: Running Headline */}
        <div 
          onClick={() => onSelectHeadline(currentItem.headline)}
          className="flex-1 truncate cursor-pointer hover:text-blue-700 dark:hover:text-amber-300 hover:underline text-slate-900 dark:text-slate-100 font-semibold"
          title={currentItem.headline}
        >
          <span>{currentItem.headline}</span>
        </div>

        {/* Right: Controls & Indicators */}
        <div className="flex items-center gap-1 shrink-0 text-slate-600 dark:text-slate-400">
          <span className="text-[11px] hidden md:inline font-mono mr-1 text-[#004a99] dark:text-amber-300 font-bold">
            {currentIndex + 1}/{BREAKING_NEWS_ITEMS.length}
          </span>
          <button
            onClick={handlePrev}
            className="p-1 hover:bg-amber-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-700 dark:text-slate-300"
            aria-label="Berita sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 hover:bg-amber-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-700 dark:text-slate-300"
            aria-label="Berita berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
