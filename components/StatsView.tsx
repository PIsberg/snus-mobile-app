import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Log, UserSettings } from '../types';
import { TrendingUp, DollarSign } from 'lucide-react';

interface StatsViewProps {
  logs: Log[];
  settings: UserSettings;
}

export const StatsView: React.FC<StatsViewProps> = ({ logs, settings }) => {
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');

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
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#334155', opacity: 0.2 }}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} dy={10} interval={3} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981' }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};