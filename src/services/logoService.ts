import { LogoSettings, DEFAULT_LOGO_SETTINGS } from '../types/logoConfig';
import { firestoreService } from './firestoreService';

const STORAGE_KEY = 'arun_news_logo_config_v3';
const EVENT_NAME = 'arun:logo_settings_changed';

export const logoService = {
  getSettings(): LogoSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_LOGO_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_LOGO_SETTINGS;
  },

  saveSettings(settings: LogoSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: settings }));
    }
    // Sync to Firestore in background
    firestoreService.saveLogoSettings(settings).catch(() => {
      // Silent catch if user is not admin
    });
  },

  resetSettings(): LogoSettings {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_LOGO_SETTINGS }));
    }
    firestoreService.saveLogoSettings(DEFAULT_LOGO_SETTINGS).catch(() => {});
    return DEFAULT_LOGO_SETTINGS;
  },

  onSettingsChange(callback: (settings: LogoSettings) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<LogoSettings>;
      callback(customEvent.detail || logoService.getSettings());
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }
};

