import React, { useState } from 'react';
import { Download, Trash2, Save, Cloud, LogOut, Play, Square, AlertTriangle } from 'lucide-react';
import { Log, UserSettings } from '../types';
import { StorageService } from '../services/storageService';
import { UserInfo } from '../services/authService';
import { showBanner, hideBanner, getAdMobStatus, initializeAdMob } from '@/src/utils/admob';

const DebugAdMob: React.FC = () => {
  const [status, setStatus] = useState(getAdMobStatus());
  const [msg, setMsg] = useState('');

  const refreshStatus = () => setStatus(getAdMobStatus());

  const runShow = async () => {
    setMsg('Showing...');
    try {
      await showBanner();
      setMsg('Show Success');
    } catch (e: any) {
      setMsg('Show Failed: ' + e.message);
    }
    refreshStatus();
  };

  const runHide = async () => {
    setMsg('Hiding...');
    await hideBanner();
    setMsg('Hidden');
    refreshStatus();
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 space-y-4">
      <div className="flex gap-2">
        <button onClick={runShow} className="flex-1 bg-emerald-600/20 text-emerald-400 p-2 rounded-lg flex items-center justify-center gap-2">
          <Play size={16} /> Show
        </button>
        <button onClick={runHide} className="flex-1 bg-slate-700 text-slate-300 p-2 rounded-lg flex items-center justify-center gap-2">
          <Square size={16} /> Hide
        </button>
      </div>
      <div className="text-xs font-mono bg-black/30 p-2 rounded text-slate-400 break-all">
        <div>Status: {status.isInitialized ? 'Initialized' : 'Not Initialized'}</div>
        <div>Last Error: {status.lastError || 'None'}</div>
        <div>Msg: {msg}</div>
      </div>
    </div>
  );
};

interface SettingsViewProps {
  settings: UserSettings;
  logs: Log[];
  user: UserInfo | null;
  onUpdateSettings: (s: UserSettings) => void;
  onClearData: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, logs, user, onUpdateSettings, onClearData, onSignIn, onSignOut, isSyncing }) => {

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Timestamp,Count,Nicotine(mg)\n"
      + logs.map(l => `${new Date(l.timestamp).toLocaleString()},${l.timestamp},${l.count},${l.nicotineAmount}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "snus_data_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    onUpdateSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  return (
    <div className="p-6 pt-8 space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      {/* Goal Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Goals & Limits</h3>
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
          <label className="block text-sm font-medium text-slate-300 mb-2">Daily Pouch Limit</label>
          <input
            type="number"
            value={settings.dailyGoal}
            onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <p className="text-xs text-slate-500 mt-2">Used to calculate your daily progress circle.</p>
        </div>
      </section>

      {/* Product Config */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Product Configuration</h3>
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nicotine per Pouch (mg)</label>
            <input
              type="number"
              step="0.1"
              value={settings.nicotinePerPouch}
              onChange={(e) => handleChange('nicotinePerPouch', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Cost per Pouch</label>
              <input
                type="number"
                step="0.01"
                value={settings.costPerUnit}
                onChange={(e) => handleChange('costPerUnit', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Sync */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Cloud Sync</h3>
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 space-y-4">
          {!user ? (
            <button
              onClick={onSignIn}
              className="w-full flex items-center justify-center p-3 bg-white text-slate-900 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              <Cloud className="mr-2" size={20} />
              Sign in with Google
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-xl border border-slate-700">
                {user.imageUrl && (
                  <img src={user.imageUrl} alt="Profile" className="w-10 h-10 rounded-full" />
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user.givenName} {user.familyName}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <button onClick={onSignOut} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <LogOut size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>{isSyncing ? 'Syncing...' : 'Synced with Google Drive'}</span>
                {isSyncing && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>}
              </div>
            </div>
          )}
          <p className="text-xs text-slate-500">
            Sign in to save your logs and settings to your Google Drive. This allows you to restore your data on other devices.
          </p>
        </div>
      </section>

      {/* Debug AdMob */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Debug AdMob</h3>
        <DebugAdMob />
      </section>

      {/* Data Management */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Data Management</h3>

        <button
          onClick={handleExport}
          className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 transition-colors group"
        >
          <span className="text-slate-200 font-medium">Export Data (CSV)</span>
          <Download size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => {
            if (window.confirm("Are you sure? This cannot be undone.")) {
              onClearData();
            }
          }}
          className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-rose-900/20 rounded-2xl border border-slate-700 hover:border-rose-800 transition-colors group"
        >
          <span className="text-rose-400 font-medium">Reset All Data</span>
          <Trash2 size={20} className="text-rose-500 group-hover:scale-110 transition-transform" />
        </button>
      </section>

      <div className="text-center pt-8 pb-4">
        <p className="text-xs text-slate-600">SnusTrack AI v1.3.0</p>
      </div>
    </div>
  );
};