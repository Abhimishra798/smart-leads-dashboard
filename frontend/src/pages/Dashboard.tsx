import React, { useEffect, useState } from 'react';
import { Users, Target, TrendingUp, BarChart3 } from 'lucide-react';

import { leadsApi } from '@/api/leadsApi';
import { Spinner } from '@/components/ui/Spinner';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    qualified: 0,
    conversionRate: '0',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await leadsApi.getStats();
        if (res.data.success && res.data.data) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'New Leads', value: stats.new, icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Qualified', value: stats.qualified, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: BarChart3, color: 'text-brand-400', bg: 'bg-brand-500/10' },
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your leads today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6 flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-100">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-surface-700 rounded-xl">
            <p className="text-slate-500">Activity chart will appear here</p>
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-surface-700 rounded-xl">
            <p className="text-slate-500">Source distribution will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};
