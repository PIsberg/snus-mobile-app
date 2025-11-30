import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './components/HomeView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { StorageService } from './services/storageService';
import { Log, UserSettings, ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [logs, setLogs] = useState<Log[]>([]);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize data
  useEffect(() => {
    const loadedLogs = StorageService.getLogs();
    setLogs(loadedLogs);
    setIsLoaded(true);
  }, []);

  const handleLog = useCallback(() => {
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
  }, [settings]);

  const handleClearData = useCallback(() => {
    StorageService.clearLogs();
    setLogs([]);
  }, []);

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
            onUpdateSettings={setSettings}
            onClearData={handleClearData}
        />
      )}
    </Layout>
  );
};

export default App;