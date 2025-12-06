import { Log, UserSettings } from '../types';

const LOGS_KEY = 'snus_logs_v1';
const SETTINGS_KEY = 'snus_settings_v1';

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 10,
  nicotinePerPouch: 8.0,
  costPerUnit: 0.5,
  currencySymbol: '$'
};

const DRIVE_FILE_NAME = 'snustrack_backup.json';

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

  setLogs: (logs: Log[]) => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
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
  },

  // Google Drive Integration
  syncWithDrive: async (accessToken: string): Promise<boolean> => {
    try {
      // 1. Find existing file
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FILE_NAME}' and trashed=false`;
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const searchData = await searchRes.json();
      const fileId = searchData.files && searchData.files.length > 0 ? searchData.files[0].id : null;

      const currentLogs = StorageService.getLogs();
      const currentSettings = StorageService.getSettings();
      const payload = JSON.stringify({ logs: currentLogs, settings: currentSettings });

      if (fileId) {
        // Update existing file
        const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: payload
        });
      } else {
        // Create new file
        const createMetadata = {
          name: DRIVE_FILE_NAME,
          mimeType: 'application/json'
        };
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(createMetadata)], { type: 'application/json' }));
        form.append('file', new Blob([payload], { type: 'application/json' }));

        const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        await fetch(createUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form
        });
      }
      return true;
    } catch (e) {
      console.error("Drive sync failed", e);
      return false;
    }
  },

  loadFromDrive: async (accessToken: string): Promise<boolean> => {
    try {
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FILE_NAME}' and trashed=false`;
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const searchData = await searchRes.json();

      if (searchData.files && searchData.files.length > 0) {
        const fileId = searchData.files[0].id;
        const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        const fileRes = await fetch(downloadUrl, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await fileRes.json();

        if (data.logs) StorageService.setLogs(data.logs);
        if (data.settings) StorageService.saveSettings(data.settings);
        return true;
      }
    } catch (e) {
      console.error("Load from drive failed", e);
    }
    return false;
  }
};