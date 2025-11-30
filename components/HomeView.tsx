import React, { useMemo, useState, useEffect } from 'react';
import { Plus, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Log, UserSettings } from '../types';

interface HomeViewProps {
  logs: Log[];
  settings: UserSettings;
  onLog: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ logs, settings, onLog }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const todayStr = new Date().toLocaleDateString();
    const todayLogs = logs.filter(l => new Date(l.timestamp).toLocaleDateString() === todayStr);
    
    return {
      count: todayLogs.length,
      nicotine: todayLogs.reduce((acc, curr) => acc + curr.nicotineAmount, 0)
    };
  }, [logs]);

  const progressPercentage = Math.min((todayStats.count / settings.dailyGoal) * 100, 100);
  const isOverLimit = todayStats.count > settings.dailyGoal;

  const handlePress = () => {
    setIsAnimating(true);
    onLog();
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Determine Color State
  let colorState = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  let progressColor = "bg-emerald-500";
  
  if (progressPercentage >= 100) {
    colorState = "text-rose-500 border-rose-500/30 bg-rose-500/10";
    progressColor = "bg-rose-500";
  } else if (progressPercentage >= 75) {
    colorState = "text-amber-400 border-amber-500/30 bg-amber-500/10";
    progressColor = "bg-amber-500";
  }

  return (
    <div className="flex flex-col h-full p-6 pt-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none" />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-500 ${isOverLimit ? 'bg-rose-500' : 'bg-emerald-500'}`} />

        {/* Header Stats */}
        <div className="z-10 flex flex-col items-center space-y-2 mb-8">
            <h1 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Today's Consumption</h1>
            <div className="flex items-baseline space-x-2">
                <span className={`text-6xl font-bold tracking-tighter transition-colors duration-300 ${isOverLimit ? 'text-rose-500' : 'text-white'}`}>
                    {todayStats.count}
                </span>
                <span className="text-xl text-slate-500">/ {settings.dailyGoal}</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-sm">
                <Zap size={14} className="text-yellow-400" fill="currentColor" />
                <span className="text-sm text-slate-300 font-medium">{todayStats.nicotine.toFixed(1)} mg nicotine</span>
            </div>
        </div>

        {/* Main Action Area */}
        <div className="flex-1 flex items-center justify-center z-10">
            <button
                onClick={handlePress}
                className={`
                    relative group w-48 h-48 rounded-full flex items-center justify-center
                    transition-all duration-100 ease-out select-none
                    border-[8px] backdrop-blur-sm shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]
                    ${colorState}
                    ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100 hover:scale-105'}
                `}
            >
                <div className={`absolute inset-0 rounded-full opacity-20 blur-md transition-colors duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                <Plus size={64} strokeWidth={3} className="relative z-10 transition-colors duration-300" />
            </button>
        </div>

        {/* Goal Progress */}
        <div className="z-10 mt-auto space-y-4">
            <div className="flex justify-between items-end text-sm">
                <span className="text-slate-400">Daily Goal</span>
                <span className={isOverLimit ? 'text-rose-500 font-bold' : 'text-emerald-400 font-bold'}>
                    {Math.round(progressPercentage)}%
                </span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
            
            {/* Status Message */}
            <div className="h-12 flex items-center justify-center">
                {isOverLimit ? (
                    <div className="flex items-center space-x-2 text-rose-400 animate-pulse">
                        <AlertTriangle size={18} />
                        <span className="text-sm font-medium">Daily limit exceeded</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-emerald-400/80">
                         {progressPercentage === 0 ? (
                            <span className="text-sm">Tap to log your first pouch</span>
                         ) : (
                             <>
                                <CheckCircle2 size={18} />
                                <span className="text-sm">You are doing great</span>
                             </>
                         )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};