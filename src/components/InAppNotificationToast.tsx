import React, { useEffect } from 'react';
import { X, Zap, ChevronRight, Bell } from 'lucide-react';
import { PushNotificationItem } from '../types/news';

interface InAppNotificationToastProps {
  notification: PushNotificationItem | null;
  onClose: () => void;
  onClickToast: (item: PushNotificationItem) => void;
}

export const InAppNotificationToast: React.FC<InAppNotificationToastProps> = ({
  notification,
  onClose,
  onClickToast
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 7000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div 
        onClick={() => onClickToast(notification)}
        className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-400 rounded-xl shadow-2xl p-4 cursor-pointer hover:border-yellow-500 transition-all flex items-start gap-3 relative overflow-hidden group"
      >
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#004a99]" />

        {/* Icon */}
        <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
          {notification.priority === 'high' ? (
            <Zap className="w-5 h-5 fill-slate-950 animate-pulse" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#004a99] dark:text-amber-400">
              {notification.priority === 'high' ? '⚡ PUSH NOTIFIKASI KILAT' : 'PEMBERITAHUAN BERITA'}
            </span>
            <span className="text-[10px] text-slate-400">Baru saja</span>
          </div>

          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
            {notification.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {notification.body}
          </p>

          <span className="mt-2 text-[11px] font-bold text-[#004a99] dark:text-amber-400 flex items-center gap-0.5">
            <span>Baca sekarang</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 -mt-1 -mr-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
