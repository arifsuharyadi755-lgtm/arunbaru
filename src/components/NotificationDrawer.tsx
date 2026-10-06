import React from 'react';
import { Bell, X, CheckCheck, Trash2, SlidersHorizontal, ChevronRight, Zap } from 'lucide-react';
import { PushNotificationItem } from '../types/news';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotificationItem[];
  onSelectNotification: (item: PushNotificationItem) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllAsRead,
  onClearAll,
  onOpenSettings
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Riwayat Push Notifikasi
            </h3>
            {unreadCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2 py-0.2 rounded-full tabular-nums shadow-xs">
                {unreadCount} baru
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Pengaturan Notifikasi"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1 hover:text-blue-700 dark:hover:text-amber-400 disabled:opacity-40 transition-colors font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca</span>
          </button>
          <button
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Riwayat</span>
          </button>
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
              <Bell className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-sm font-medium">Belum ada riwayat notifikasi</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Notifikasi breaking news dan perkembangan berita terkini akan tercatat di sini.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3.5 rounded-xl cursor-pointer transition-colors relative flex items-start gap-3 group ${
                  notif.read
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/60 opacity-85'
                    : 'bg-amber-50/60 dark:bg-blue-950/40 hover:bg-amber-50 dark:hover:bg-blue-950/60'
                }`}
              >
                {/* Priority / Channel Icon */}
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                  notif.priority === 'high' 
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' 
                    : 'bg-[#004a99] text-amber-300'
                }`}>
                  {notif.priority === 'high' ? <Zap className="w-4 h-4 fill-slate-950" /> : <Bell className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-amber-400">
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-amber-400 transition-colors leading-snug">
                    {notif.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {notif.body}
                  </p>
                </div>

                {/* Unread Pip */}
                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 self-center shadow-xs" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
          <button
            onClick={onOpenSettings}
            className="text-xs text-[#004a99] dark:text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Kustomisasi Minat & Frekuensi Notifikasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
