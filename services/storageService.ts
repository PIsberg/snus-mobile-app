import { Log, UserSettings } from '../types';

const LOGS_KEY = 'snus_logs_v1';
const SETTINGS_KEY = 'snus_settings_v1';

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 10,
  nicotinePerPouch: 8.0,
  costPerUnit: 0.5,
  currencySymbol: '$'
};

export const StorageService = {
  getLogs: (): Log[] => {
    try {
      const stored = localStorage.getItem(LOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load logs", e);
      return [];
    }
  },

  saveLog: (log: Log): Log[] => {
    const logs = StorageService.getLogs();
    const updated = [...logs, log];
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
    return updated;
  },

  clearLogs: (): void => {
    localStorage.removeItem(LOGS_KEY);
  },

  getSettings: (): UserSettings => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: UserSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};