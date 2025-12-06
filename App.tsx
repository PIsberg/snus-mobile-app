import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './components/HomeView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { StorageService } from './services/storageService';
import { AuthService, UserInfo } from './services/authService';
import { Log, UserSettings, ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [logs, setLogs] = useState<Log[]>([]);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize data and auth
  useEffect(() => {
    const init = async () => {
      const loadedLogs = StorageService.getLogs();
      setLogs(loadedLogs);

      await AuthService.initialize();
      const currentUser = await AuthService.refresh();
      if (currentUser) {
        setUser(currentUser);
        setIsSyncing(true);
        await StorageService.loadFromDrive(currentUser.accessToken);
        // Refresh logs/settings after download
        setLogs(StorageService.getLogs());
        setSettings(StorageService.getSettings());
        setIsSyncing(false);
      }

      setIsLoaded(true);
    };
    init();
  }, []);

  const syncData = useCallback(async (token: string) => {
    setIsSyncing(true);
    await StorageService.syncWithDrive(token);
    setIsSyncing(false);
  }, []);

  const handleSignIn = async () => {
    const userInfo = await AuthService.signIn();
    if (userInfo) {
      setUser(userInfo);
      setIsSyncing(true);
      await StorageService.loadFromDrive(userInfo.accessToken);
      setLogs(StorageService.getLogs());
      setSettings(StorageService.getSettings());
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  const handleLog = useCallback(async () => {
    const now = new Date();
    const newLog: Log = {
      id: crypto.randomUUID(),
      timestamp: now.getTime(),
      localDateString: now.toLocaleDateString(),
      count: 1,
      nicotineAmount: settings.nicotinePerPouch
    };

    const updatedLogs = StorageService.saveLog(newLog);
    setLogs(updatedLogs);

    if (user) {
      await syncData(user.accessToken);
    }
  }, [settings, user, syncData]);

  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    // StorageService.saveSettings(newSettings) is called in SettingsView, 
    // but strictly speaking we should probably do it here to orchestrate sync.
    // However, SettingsView calls saveSettings. Let's rely on that for local, 
    // but we need to trigger sync.
    // Actually SettingsView calls setSettings(prop) -> handleUpdateSettings.
    // So we should save to storage here too or ensuring state consistent.
    // Best practice: Lift state up. SettingsView shouldn't call StorageService directly if App manages it.
    // But for minimal refactor, let's just sync here.

    StorageService.saveSettings(newSettings); // Ensure local persistence

    if (user) {
      await syncData(user.accessToken);
    }
  };

  const handleClearData = useCallback(async () => {
    StorageService.clearLogs();
    setLogs([]);
    if (user) {
      await syncData(user.accessToken);
    }
  }, [user, syncData]);

  if (!isLoaded) return <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-emerald-500">Loading...</div>;

  return (
    <Layout currentView={view} onChangeView={setView}>
      {view === ViewState.HOME && (
        <HomeView
          logs={logs}
          settings={settings}
          onLog={handleLog}
        />
      )}
      {view === ViewState.STATS && (
        <StatsView
          logs={logs}
          settings={settings}
        />
      )}
      {view === ViewState.SETTINGS && (
        <SettingsView
          settings={settings}
          logs={logs}
          user={user}
          onUpdateSettings={handleUpdateSettings}
          onClearData={handleClearData}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          isSyncing={isSyncing}
        />
      )}
    </Layout>
  );
};

export default App;