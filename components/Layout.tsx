import React, { useEffect, useState } from 'react';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import { ViewState } from '../types';
import { Capacitor } from '@capacitor/core';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  return (
    <div className={`flex flex-col h-screen bg-slate-900 text-white overflow-hidden max-w-md mx-auto shadow-2xl border-x border-slate-800 ${isNative ? 'pb-[60px]' : ''}`}>
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around pb-4 pt-2 z-50">
        <button
          onClick={() => onChangeView(ViewState.HOME)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === ViewState.HOME ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          <LayoutDashboard size={24} strokeWidth={currentView === ViewState.HOME ? 2.5 : 2} />
          <span className="text-xs font-medium">Tracker</span>
        </button>

        <button
          onClick={() => onChangeView(ViewState.STATS)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === ViewState.STATS ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          <BarChart3 size={24} strokeWidth={currentView === ViewState.STATS ? 2.5 : 2} />
          <span className="text-xs font-medium">Stats</span>
        </button>

        <button
          onClick={() => onChangeView(ViewState.SETTINGS)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === ViewState.SETTINGS ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          <Settings size={24} strokeWidth={currentView === ViewState.SETTINGS ? 2.5 : 2} />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
};