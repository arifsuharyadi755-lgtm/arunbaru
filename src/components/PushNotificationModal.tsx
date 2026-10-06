import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Zap, 
  Sparkles,
  Smartphone,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { 
  pushNotificationService, 
  NotificationSettings 
} from '../services/pushNotificationService';
import { NotificationChannel } from '../types/news';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestNotif: () => void;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({
  isOpen,
  onClose,
  onTriggerTestNotif
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(pushNotificationService.getSettings());
  const [channels, setChannels] = useState<NotificationChannel[]>(pushNotificationService.getChannels());
  const [requesting, setRequesting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPermission(pushNotificationService.getPermission());
      setSettings(pushNotificationService.getSettings());
      setChannels(pushNotificationService.getChannels());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    setRequesting(true);
    const newPerm = await pushNotificationService.requestPermission();
    setPermission(newPerm);
    setRequesting(false);

    if (newPerm === 'granted') {
      setSuccessBanner('Izin browser berhasil diaktifkan! Anda kini akan menerima notifikasi kilat berita utama.');
      setTimeout(() => setSuccessBanner(null), 4000);
      // Send welcome notification
      pushNotificationService.sendNotification({
        title: '🔔 Notifikasi Arun News Aktif!',
        body: 'Selamat datang! Anda kini menjadi yang pertama mengetahui perkembangan berita penting Indonesia.',
        category: 'politik',
        priority: 'high'
      });
    }
  };

  const handleToggleChannel = (id: string) => {
    const updated = channels.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c);
    setChannels(updated);
    pushNotificationService.saveChannels(updated);
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
    pushNotificationService.saveSettings(updated);
  };

  const handleToggleAutoSimulate = () => {
    const updated = { ...settings, autoSimulate: !settings.autoSimulate };
    setSettings(updated);
    pushNotificationService.saveSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#004a99] flex items-center justify-center text-amber-300 shadow-xs border border-amber-400/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pusat Pengaturan Push Notifikasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kustomisasi berita penting yang ingin Anda terima secara real-time
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-6 text-xs sm:text-sm">
          {/* Permission Status Box */}
          <div className="p-4 rounded-xl border transition-colors bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {permission === 'granted' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : permission === 'denied' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    Status Izin Browser:{' '}
                    <span className={`font-mono text-xs uppercase ${
                      permission === 'granted' ? 'text-emerald-600 dark:text-emerald-400 font-bold' :
                      permission === 'denied' ? 'text-rose-600 dark:text-rose-400 font-bold' :
                      'text-blue-700 dark:text-amber-400 font-bold'
                    }`}>
                      {permission === 'granted' ? 'Aktif (Diizinkan)' :
                       permission === 'denied' ? 'Diblokir oleh Browser' :
                       'Belum Diizinkan'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {permission === 'granted'
                      ? 'Browser Anda terhubung penuh untuk menerima breaking news langsung di desktop/perangkat.'
                      : permission === 'denied'
                      ? 'Izin notifikasi diblokir di pengaturan browser. Anda tetap dapat melihat notifikasi di bilah toast aplikasi.'
                      : 'Klik tombol di samping untuk mengaktifkan notifikasi native browser Arun News.'}
                  </p>
                </div>
              </div>

              {permission !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  disabled={requesting}
                  className="px-3.5 py-2 bg-[#004a99] hover:bg-blue-800 text-amber-300 font-bold text-xs rounded-lg transition-colors shrink-0 shadow-xs flex items-center gap-1.5 border border-amber-400/40"
                >
                  {requesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>{permission === 'denied' ? 'Ulangi Cek' : 'Izinkan Sekarang'}</span>
                </button>
              )}
            </div>

            {successBanner && (
              <div className="mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg">
                {successBanner}
              </div>
            )}
          </div>

          {/* Quick Action: Test Push Notification */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-amber-300/50 dark:border-amber-400/30 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-[#004a99] dark:text-amber-300 text-xs sm:text-sm">
                  Uji Coba Pengiriman Notifikasi
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Kirim simulasi berita kilat sekarang untuk menguji suara & pop-up
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onTriggerTestNotif();
              }}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Tes Notif</span>
            </button>
          </div>

          {/* Granular Channel Subscriptions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Pilihan Kanal Berita Berlangganan
            </h4>
            <div className="space-y-2.5">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => handleToggleChannel(channel.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    channel.enabled
                      ? 'bg-white dark:bg-slate-800/80 border-blue-200 dark:border-blue-900/60 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70'
                  }`}
                >
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        {channel.name}
                      </span>
                      {channel.id === 'breaking' && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded shadow-xs">
                          PRIORITAS
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {channel.description}
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                    channel.enabled ? 'bg-[#004a99] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}>
                    <div className="bg-amber-300 w-4 h-4 rounded-full shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sound & Preference Settings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Pengaturan Suara & Frekuensi
            </h4>
            <div className="space-y-2.5">
              {/* Sound Toggle */}
              <div 
                onClick={handleToggleSound}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Suara Notifikasi Audio Ping
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Bunyikan nada lonceng khas berita saat ada kabar terkini
                    </p>
                  </div>
                </div>

                <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                  settings.soundEnabled ? 'bg-[#004a99] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}>
                  <div className="bg-amber-300 w-4 h-4 rounded-full shadow-md" />
                </div>
              </div>

              {/* Simulation Dispatcher Toggle */}
              <div 
                onClick={handleToggleAutoSimulate}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      Simulasi Pembaruan Berita Berkala
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Menerima perkembangan berita nasional setiap beberapa menit
                    </p>
                  </div>
                </div>

                <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                  settings.autoSimulate ? 'bg-[#004a99] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}>
                  <div className="bg-amber-300 w-4 h-4 rounded-full shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-900/90">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#004a99] hover:bg-blue-800 text-amber-300 border border-amber-400/40 font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-xs"
          >
            Selesai & Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
