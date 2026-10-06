import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Bookmark, 
  TrendingUp, 
  CloudSun, 
  Clock, 
  SlidersHorizontal,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Megaphone,
  Palette
} from 'lucide-react';
import { CATEGORIES } from '../data/newsData';
import { CategoryId } from '../types/news';
import { ArunNewsLogo } from './ArunNewsLogo';

interface HeaderProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  activeSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadNotifCount: number;
  onOpenNotifications: () => void;
  onOpenNotifSettings: () => void;
  savedArticlesCount: number;
  onOpenBookmarks: () => void;
  onTriggerTestNotif: () => void;
  onOpenAdvertise?: () => void;
  onOpenLogoCustomizer?: () => void;
  onOpenEditorialAdmin?: (tab?: 'logo' | 'redaksi' | 'announcement') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  activeSubcategory,
  onSelectSubcategory,
  searchQuery,
  onSearchChange,
  unreadNotifCount,
  onOpenNotifications,
  onOpenNotifSettings,
  savedArticlesCount,
  onOpenBookmarks,
  onTriggerTestNotif,
  onOpenAdvertise,
  onOpenLogoCustomizer,
  onOpenEditorialAdmin
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      const datePart = now.toLocaleDateString('id-ID', options);
      const timePart = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
      setCurrentDateTime(`${datePart} · ${timePart}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Utility Bar */}
      <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[12px] text-slate-600 dark:text-slate-400 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          {/* Left: Live Indonesian Date & Time + Weather */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{currentDateTime || 'Memuat waktu...'}</span>
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>Jakarta, 31°C Cerah Berawan</span>
            </span>
          </div>

          {/* Right: Quick Markets & Accessibility */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <span>USD/IDR</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">Rp 15.650</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span>IHSG 7.785 (+1,82%)</span>
              </span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-700">
              {/* Pasang Iklan Top Bar Button */}
              {onOpenAdvertise && (
                <button
                  onClick={onOpenAdvertise}
                  title="Pasang Iklan di Arun News"
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-md border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors shadow-xs"
                >
                  <Megaphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Pasang Iklan</span>
                </button>
              )}

              {/* Test Push Quick Button */}
              <button
                onClick={onTriggerTestNotif}
                title="Kirim Tes Notifikasi Berita"
                className="hidden lg:flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Tes Push Notif</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Search Bar (Signature Detikcom Blue) */}
      <div className="bg-[#004a99] text-white py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo Lockup */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                onSelectCategory('all');
                onSelectSubcategory('Semua');
              }}
              className="text-left group flex items-center focus:outline-none"
              title="Kembali ke Beranda Arun News"
            >
              <ArunNewsLogo size="md" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md mx-2 hidden sm:block">
            <div className={`flex items-center bg-white/10 hover:bg-white/15 focus-within:bg-white text-slate-900 rounded-lg px-3 py-1.5 transition-all border ${
              searchFocused ? 'bg-white border-amber-400 shadow-sm' : 'border-white/20'
            }`}>
              <Search className={`w-4 h-4 mr-2 shrink-0 ${searchFocused ? 'text-slate-500' : 'text-blue-200'}`} />
              <input
                type="text"
                placeholder="Cari berita terkini, tokoh, isu..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full text-xs sm:text-sm bg-transparent border-none outline-none ${
                  searchFocused ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-blue-200'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="p-0.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons: Push Notifications & Saved Bookmarks */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Pasang Iklan Trigger */}
            {onOpenAdvertise && (
              <button
                onClick={onOpenAdvertise}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold text-amber-300 hover:bg-white/10 border border-amber-400/40 transition-colors whitespace-nowrap"
                title="Layanan Pasang Iklan & Media Kit"
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-300" />
                <span>Pasang Iklan</span>
              </button>
            )}

            {/* Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-white hover:bg-white/10 transition-colors relative"
              title="Berita Tersimpan"
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline">Tersimpan</span>
              {savedArticlesCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                  {savedArticlesCount}
                </span>
              )}
            </button>

            {/* Push Notification Drawer Trigger */}
            <button
              onClick={onOpenNotifications}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-white hover:bg-white/10 transition-colors relative"
              title="Pemberitahuan Berita"
            >
              <Bell className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline">Notifikasi</span>
              {unreadNotifCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full tabular-nums animate-pulse shadow-xs">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Push Notification Settings Modal Trigger */}
            <button
              onClick={onOpenNotifSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-900" />
              <span>Kelola Notif</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 sm:hidden">
          <div className="flex items-center bg-white text-slate-900 rounded-md px-2.5 py-1.5 shadow-inner">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="p-0.5 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Kanal Categories Bar (Easily Navigable Detik Sub-portals) */}
      <nav aria-label="Kanal Berita" className="bg-[#003875] dark:bg-slate-900 text-white border-b border-blue-900/60 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 whitespace-nowrap min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectSubcategory('Semua');
                }}
                className={`relative px-3.5 py-2.5 text-xs sm:text-[13px] font-semibold tracking-wide uppercase transition-all duration-150 flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-amber-300 bg-[#004a99] dark:bg-blue-950 font-bold border-b-2 border-amber-400' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{cat.badge}</span>
                {cat.id === 'olahraga' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Subcategory Filter Ribbon */}
      <div className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 py-1.5 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs whitespace-nowrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2 shrink-0">
            {currentCategoryObj.badge} &gt;
          </span>
          {currentCategoryObj.subcategories.map((sub) => {
            const isSubActive = activeSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => onSelectSubcategory(sub)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  isSubActive
                    ? 'bg-[#004a99] text-amber-300 border border-amber-400/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
