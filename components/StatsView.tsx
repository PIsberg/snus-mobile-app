import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Log, UserSettings } from '../types';
import { Sparkles, Loader2, TrendingUp, DollarSign } from 'lucide-react';
import { analyzeHabits } from '../services/geminiService';

interface StatsViewProps {
  logs: Log[];
  settings: UserSettings;
}

export const StatsView: React.FC<StatsViewProps> = ({ logs, settings }) => {
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Data Aggregation
  const chartData = useMemo(() => {
    const now = new Date();
    const data: { name: string; count: number }[] = [];
    const days = activeTab === 'week' ? 7 : 30;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString();
      
      const count = logs.filter(l => new Date(l.timestamp).toLocaleDateString() === dateStr).length;
      
      data.push({
        name: activeTab === 'week' ? d.toLocaleDateString('en-US', { weekday: 'short' }) : d.getDate().toString(),
        count
      });
    }
    return data;
  }, [logs, activeTab]);

  const totalCost = logs.length * settings.costPerUnit;
  const totalNicotine = logs.reduce((acc, curr) => acc + curr.nicotineAmount, 0);

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    const result = await analyzeHabits(logs, settings);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  return (
    <div className="p-6 pt-8 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-slate-400 mb-1">
            <DollarSign size={16} />
            <span className="text-xs uppercase font-bold tracking-wider">Est. Cost</span>
          </div>
          <p className="text-2xl font-bold text-white">{settings.currencySymbol}{totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-slate-400 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs uppercase font-bold tracking-wider">Total Nicotine</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{totalNicotine.toFixed(0)} <span className="text-sm font-normal text-slate-500">mg</span></p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-800/30 rounded-3xl p-5 border border-slate-700/50">
        <div className="flex space-x-2 bg-slate-900/50 p-1 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab('week')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'week' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Week
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'month' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Month
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'week' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.2}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 10}} tickLine={false} axisLine={false} dy={10} interval={3} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981' }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gemini AI Integration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
             <h3 className="text-lg font-semibold text-slate-200">AI Coach</h3>
             <Sparkles size={16} className="text-purple-400" />
        </div>
       
        {!aiAnalysis ? (
            <button
                onClick={handleAiAnalysis}
                disabled={loadingAi}
                className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
                <div className="flex items-center justify-center space-x-2 relative z-10">
                    {loadingAi ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Analyzing your habits...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            <span>Generate Insights</span>
                        </>
                    )}
                </div>
            </button>
        ) : (
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-5 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-2 py-1 rounded">Insight</span>
                    <button onClick={() => setAiAnalysis(null)} className="text-slate-400 hover:text-white text-xs">Close</button>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {aiAnalysis}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};