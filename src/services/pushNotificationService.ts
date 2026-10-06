import { CategoryId, PushNotificationItem, NotificationChannel } from '../types/news';

const STORAGE_KEYS = {
  SETTINGS: 'detik_notification_settings_v1',
  HISTORY: 'detik_notification_history_v1',
  CHANNELS: 'detik_notification_channels_v1'
};

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  autoSimulate: boolean;
  frequencyMinutes: number;
}

export const DEFAULT_CHANNELS: NotificationChannel[] = [
  {
    id: 'breaking',
    name: 'Breaking News Kilat',
    description: 'Pemberitahuan peristiwa genting, darurat, dan berita utama',
    enabled: true
  },
  {
    id: 'politik',
    name: 'Politik',
    description: 'Update kebijakan publik, pemilu, DPR, dan isu pemerintahan',
    enabled: true
  },
  {
    id: 'olahraga',
    name: 'Olahraga',
    description: 'Skor langsung pertandingan, Timnas Indonesia, dan kabar atlet',
    enabled: true
  },
  {
    id: 'kriminal',
    name: 'Kriminal',
    description: 'Operasi kepolisian, kejahatan siber, narkoba, dan penegakan hukum',
    enabled: true
  },
  {
    id: 'ekonomi',
    name: 'Ekonomi',
    description: 'Pergerakan IHSG, kurs rupiah, harga bahan pokok, dan bisnis UMKM',
    enabled: true
  },
  {
    id: 'daerah',
    name: 'Daerah',
    description: 'Kabar pembangunan, peristiwa, dan perkembangan di seluruh provinsi',
    enabled: true
  },
  {
    id: 'lain_lain',
    name: 'Lain-lain',
    description: 'Gaya hidup, inovasi sains & teknologi, wisata, dan opini',
    enabled: true
  },
  {
    id: 'lapor_warga',
    name: 'Lapor Warga',
    description: 'Aduan fasilitas umum, aspirasi masyarakat, dan tindak lanjut dinas',
    enabled: true
  },
  {
    id: 'legalitas',
    name: 'Legalitas',
    description: 'Konsultasi hukum, regulasi perizinan usaha OSS, dan agraria',
    enabled: true
  }
];

class PushNotificationService {
  private listeners: Array<(notification: PushNotificationItem) => void> = [];

  // Check if browser supports notifications
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  // Get current permission status
  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  // Request browser permission
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  // Play subtle news broadcast audio ping using Web Audio API
  public playChime(): void {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const now = ctx.currentTime;
      // First pleasant note (E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Second higher note (B5) for alert signature
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.15, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch {
      // Audio playback failed or blocked by browser policy
    }
  }

  // Load Settings
  public getSettings(): NotificationSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      enabled: true,
      soundEnabled: true,
      autoSimulate: true,
      frequencyMinutes: 3
    };
  }

  // Save Settings
  public saveSettings(settings: NotificationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore storage error
    }
  }

  // Get Channels
  public getChannels(): NotificationChannel[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHANNELS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_CHANNELS;
  }

  // Save Channels
  public saveChannels(channels: NotificationChannel[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
    } catch {
      // ignore
    }
  }

  // Get notification history
  public getHistory(): PushNotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    // Default initial notifications so user sees history right away
    return [
      {
        id: 'notif-init-1',
        title: '⚡ BREAKING NEWS: Koridor Baru Kereta Cepat Diresmikan',
        body: 'Pemerintah resmikan operasional penuh koridor transportasi massal Nusantara.',
        category: 'politik',
        articleId: 'art-1',
        timestamp: Date.now() - 10 * 60 * 1000,
        read: false,
        priority: 'high'
      },
      {
        id: 'notif-init-2',
        title: '📈 IHSG Tembus Rekor Baru di Bursa Efek',
        body: 'Arus modal investor asing melesat lebih dari Rp 2 Triliun pada sesi pembukaan.',
        category: 'ekonomi',
        articleId: 'art-2',
        timestamp: Date.now() - 30 * 60 * 1000,
        read: true,
        priority: 'normal'
      }
    ];
  }

  // Save history
  public saveHistory(history: PushNotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));
    } catch {
      // ignore
    }
  }

  // Subscribe to new notification arrivals
  public onNotification(callback: (notification: PushNotificationItem) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Send a notification (Both native browser if allowed + in-app)
  public sendNotification(item: Omit<PushNotificationItem, 'id' | 'timestamp' | 'read'>): PushNotificationItem {
    const settings = this.getSettings();
    const channels = this.getChannels();

    // Check if channel is enabled
    const channelMatch = channels.find(c => c.id === item.category || (item.priority === 'high' && c.id === 'breaking'));
    if (channelMatch && !channelMatch.enabled) {
      // User turned off notifications for this channel
    }

    const fullItem: PushNotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      read: false,
      ...item
    };

    // Save to history
    const history = this.getHistory();
    history.unshift(fullItem);
    this.saveHistory(history);

    // Play chime sound if enabled
    if (settings.soundEnabled) {
      this.playChime();
    }

    // Native browser notification if permission is granted
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const nativeNotif = new Notification(fullItem.title, {
          body: fullItem.body,
          icon: '/favicon.ico',
          tag: fullItem.id,
          silent: !settings.soundEnabled
        });

        nativeNotif.onclick = () => {
          window.focus();
          // dispatch custom event to open article
          if (fullItem.articleId) {
            window.dispatchEvent(new CustomEvent('detik:open_article', { detail: fullItem.articleId }));
          }
        };
      } catch {
        // notification creation error
      }
    }

    // Trigger in-app listeners
    this.listeners.forEach(cb => {
      try {
        cb(fullItem);
      } catch {
        // listener error
      }
    });

    return fullItem;
  }
}

export const pushNotificationService = new PushNotificationService();
