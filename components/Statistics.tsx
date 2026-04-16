
import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Clock, 
  AlertCircle,
  TrendingUp,
  FileText,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Gavel
} from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface StatisticsProps {
  language: Language;
}

const SimplePieChart = ({ data, title, totalLabel }: { data: { label: string, value: number, color: string }[], title: string, totalLabel: string }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;

  const gradient = data.map(item => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const start = currentAngle;
    const end = currentAngle + percentage;
    currentAngle = end;
    return `${item.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="flex flex-col items-center w-full">
      <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 text-center h-8 flex items-center">{title}</h4>
      <div className="relative w-40 h-40 rounded-full shrink-0" style={{ background: total > 0 ? `conic-gradient(${gradient})` : '#e2e8f0' }}>
        <div className="absolute inset-0 m-6 bg-white dark:bg-slate-900 rounded-full flex flex-col items-center justify-center shadow-inner">
           <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{total.toLocaleString()}</span>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{totalLabel}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-6 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-[10px]">
             <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
               <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{item.label}</span>
             </div>
             <div className="flex items-center gap-1">
               <span className="font-black text-slate-800 dark:text-slate-100">{item.value.toLocaleString()}</span>
               <span className="text-slate-400 font-medium">({total > 0 ? Math.round((item.value / total) * 100) : 0}%)</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, isRtl }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
    <div className={`flex justify-between items-start mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
      <div className={`p-4 rounded-2xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {trend && (
        <span className="flex items-center text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl border border-blue-100/50 dark:border-blue-800/50">
          <TrendingUp size={12} className={isRtl ? 'ml-1.5' : 'mr-1.5'} /> {trend}
        </span>
      )}
    </div>
    <h3 className={`text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>{title}</h3>
    <p className={`text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight ${isRtl ? 'text-right' : 'text-left'}`}>{value}</p>
  </div>
);

export const Statistics: React.FC<StatisticsProps> = ({ language }) => {
  const t = translations[language];
  const isRtl = t.dir === 'rtl';
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/statistics/summary/`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-500" dir={t.dir}>
      <section>
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
          <div className={isRtl ? 'text-right' : ''}>
            <div className={`flex items-center gap-4 mb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="h-10 w-2 bg-blue-700 rounded-full"></div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase">
                {t.statTitle}
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-medium text-lg">
              {t.statSubtitle}
            </p>
          </div>
          <div className="bg-blue-900 text-white px-6 py-4 rounded-3xl flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shrink-0">
            <BarChart3 size={18} />
            {t.realTimeUpdates}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            title={t.totalRequests} 
            value={stats?.total_requests?.toLocaleString() || "0"} 
            icon={<FileText className="text-blue-600 dark:text-blue-400" size={24} />} 
            color="bg-blue-50 dark:bg-blue-900/30"
            trend={stats?.requests_trend}
            isRtl={isRtl}
          />
          <StatCard 
            title={t.appealsFiled} 
            value={stats?.appeals_filed?.toLocaleString() || "0"} 
            icon={<AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />} 
            color="bg-amber-50 dark:bg-amber-900/30"
            trend={stats?.appeals_trend}
            isRtl={isRtl}
          />
          <StatCard 
            title={t.resolvedCases} 
            value={stats?.resolved_cases?.toLocaleString() || "0"} 
            icon={<FileCheck className="text-blue-600 dark:text-blue-400" size={24} />} 
            color="bg-blue-50 dark:bg-blue-900/30"
            trend={stats?.resolved_trend}
            isRtl={isRtl}
          />
          <StatCard 
            title={t.avgResponse} 
            value={`${stats?.avg_response_time || 0} ${t.days}`} 
            icon={<Clock className="text-indigo-600 dark:text-indigo-400" size={24} />} 
            color="bg-indigo-50 dark:bg-indigo-900/30"
            isRtl={isRtl}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <StatCard 
            title={language === Language.UR ? 'معلومات فراہم کی گئی' : language === Language.SD ? 'معلومات فراهم ڪئي وئي' : 'Information Provided'}
            value={stats?.disposed_info_provided?.toLocaleString() || "0"} 
            icon={<FileCheck className="text-emerald-600 dark:text-emerald-400" size={24} />} 
            color="bg-emerald-50 dark:bg-emerald-900/30"
            isRtl={isRtl}
          />
          <StatCard 
            title={language === Language.UR ? 'ناقابل سماعت' : language === Language.SD ? 'ناقابل سماعت' : 'Non-Maintainable'}
            value={stats?.disposed_non_maintainable?.toLocaleString() || "0"} 
            icon={<AlertCircle className="text-red-600 dark:text-red-400" size={24} />} 
            color="bg-red-50 dark:bg-red-900/30"
            isRtl={isRtl}
          />
          <StatCard 
            title={t.penalizedCases} 
            value={stats?.penalized_cases?.toLocaleString() || "0"} 
            icon={<Gavel className="text-orange-600 dark:text-orange-400" size={24} />} 
            color="bg-orange-50 dark:bg-orange-900/30"
            isRtl={isRtl}
          />
        </div>
      </section>

      <section className={`grid grid-cols-1 lg:grid-cols-2 gap-8`}>
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className={`flex justify-between items-center mb-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
             <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
               {language === Language.UR ? 'شکایات کا تجزیہ' : language === Language.SD ? 'شڪايتن جو تجزيو' : 'Complaints Analysis'}
             </h3>
             <PieChart className="text-blue-600" size={24} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <SimplePieChart 
              title={language === Language.UR ? 'شکایت کی حیثیت' : language === Language.SD ? 'شڪايت جي صورتحال' : 'Complaint Status'}
              totalLabel="Total"
              data={[
                { label: 'Info Provided', value: stats?.disposed_info_provided || 0, color: '#10b981' }, // Emerald
                { label: 'Non-Maintainable', value: stats?.disposed_non_maintainable || 0, color: '#ef4444' }, // Red
                { label: 'Penalized', value: stats?.penalized_cases || 0, color: '#ea580c' }, // Orange
                { label: 'Pending', value: stats?.pending_complaints || 0, color: '#f59e0b' }, // Amber
                { label: 'Other Disposed', value: Math.max(0, (stats?.resolved_cases || 0) - ((stats?.disposed_info_provided || 0) + (stats?.disposed_non_maintainable || 0))), color: '#3b82f6' } // Blue
              ]}
            />
            <SimplePieChart 
              title={language === Language.UR ? 'جمع کرانے کا طریقہ' : language === Language.SD ? 'جمع ڪرائڻ جو طريقو' : 'Filing Mode'}
              totalLabel="Total"
              data={[
                { label: 'Online Portal', value: stats?.filing_modes?.portal || 0, color: '#8b5cf6' }, // Violet
                { label: 'Courier Service', value: stats?.filing_modes?.courier || 0, color: '#ec4899' }, // Pink
                { label: 'By Hand', value: stats?.filing_modes?.by_hand || 0, color: '#06b6d4' } // Cyan
              ]}
            />
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className={isRtl ? 'text-right' : ''}>
              <h3 className="text-2xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">{t.accessDetailedData}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                {t.accessDetailedDataDesc}
              </p>
            </div>
            {stats?.annual_report ? (
              <a 
                href={stats.annual_report} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-3 w-fit ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                {t.downloadAnnualReport} <ArrowUpRight size={16} className={isRtl ? 'rotate-[-90deg]' : ''} />
              </a>
            ) : null}
          </div>
          <div className={`absolute bottom-[-20%] ${isRtl ? 'left-[-10%]' : 'right-[-10%]'} w-48 h-48 bg-blue-500/10 rounded-full blur-3xl`}></div>
        </div>
      </section>
    </div>
  );
};
