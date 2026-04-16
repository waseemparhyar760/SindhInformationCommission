import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Eye, Calendar, DollarSign, Filter, Search, PieChart as PieChartIcon, BarChart as BarChartIcon, TrendingUp, LayoutGrid } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';
import { API_BASE_URL } from '../config';

interface BudgetProps {
  language: Language;
}

const PieChart = ({ data, labels, grant, balance }: { data: any[], labels: { breakdown: string, total: string, grant: string, balance: string }, grant: number, balance: number }) => {
  const [hoveredSegment, setHoveredSegment] = useState<any | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());
  const chartRef = useRef<HTMLDivElement>(null);
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  
  const allData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length],
    value: Number(item.value) || 0,
    originalIndex: index
  }));

  const visibleData = allData.filter((_, index) => !hiddenIndices.has(index));
  const total = visibleData.reduce((acc, item) => acc + item.value, 0);
  let currentPercent = 0;
  
  const chartData = visibleData.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const startAngle = currentPercent * 3.6;
    const endAngle = (currentPercent + percentage) * 3.6;
    currentPercent += percentage;
    
    return {
      ...item,
      startAngle,
      endAngle,
    };
  });

  useEffect(() => {
    setAnimationProgress(0);
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4); // EaseOutQuart
      
      setAnimationProgress(easeProgress * 100);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [hiddenIndices, data]);

  const gradient = chartData.map(item => {
    const startPercent = item.startAngle / 3.6;
    const endPercent = item.endAngle / 3.6;
    
    if (startPercent > animationProgress) return null;
    const effectiveEndPercent = Math.min(endPercent, animationProgress);
    
    return `${item.color} ${startPercent}% ${effectiveEndPercent}%`;
  }).filter(Boolean).join(', ');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const angleRad = Math.atan2(y - cy, x - cx);
    let angleDeg = angleRad * (180 / Math.PI);
    if (angleDeg < 0) angleDeg += 360;
    
    const adjustedAngle = (450 - angleDeg) % 360;

    const segment = chartData.find(d => adjustedAngle >= d.startAngle && adjustedAngle < d.endAngle);
    
    setHoveredSegment(segment || null);
    setTooltipPosition({ x: e.pageX, y: e.pageY });
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  const toggleSegment = (index: number) => {
    const newHidden = new Set(hiddenIndices);
    if (newHidden.has(index)) {
      newHidden.delete(index);
    } else {
      newHidden.add(index);
    }
    setHiddenIndices(newHidden);
  };

  if (allData.reduce((acc, item) => acc + item.value, 0) === 0) return null;

  return (
    <>
      {hoveredSegment && (
        <div 
          className="fixed z-50 p-2 px-3 text-xs font-bold text-white bg-slate-900 rounded-md shadow-lg pointer-events-none"
          style={{ top: tooltipPosition.y + 15, left: tooltipPosition.x + 15 }}
        >
          {hoveredSegment.label}: PKR {Number(hoveredSegment.value).toLocaleString()}
        </div>
      )}
      <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">{labels.breakdown}</h4>
        <div className="flex flex-wrap items-center justify-center gap-8">
            <div 
                ref={chartRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-32 h-32 rounded-full shrink-0 shadow-sm border-4 border-white dark:border-slate-800 cursor-pointer transition-all duration-300"
                style={{ background: gradient ? `conic-gradient(${gradient})` : 'transparent' }}
            ></div>
            <div className="grid grid-cols-1 gap-y-2 min-w-[140px]">
                {allData.map((item, i) => {
                  const isHidden = hiddenIndices.has(i);
                  const percentage = total > 0 && !isHidden ? Math.round((item.value / total) * 100) : 0;
                  
                  return (
                <button key={i} onClick={() => toggleSegment(i)} className={`flex items-center gap-3 text-xs text-left transition-all ${isHidden ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-colors" style={{ backgroundColor: isHidden ? '#cbd5e1' : item.color }}></div>
                    <div className="flex flex-col">
                        <span className={`font-bold ${isHidden ? 'text-slate-400 decoration-line-through' : 'text-slate-700 dark:text-slate-200'}`}>{item.label}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            PKR {item.value.toLocaleString()} {!isHidden && <span className="opacity-60">({percentage}%)</span>}
                        </span>
                    </div>
                </button>
                )})}
            </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{labels.grant}</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">PKR {Number(grant).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{labels.total}</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">PKR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{labels.balance}</span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">PKR {Number(balance).toLocaleString()}</span>
            </div>
        </div>
    </div>
    </>
  );
};

const BarChart = ({ data, labels, grant, balance }: { data: any[], labels: { breakdown: string, total: string, grant: string, balance: string }, grant: number, balance: number }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  const total = data.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  const maxVal = Math.max(...data.map(item => Number(item.value) || 0));

  return (
    <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">{labels.breakdown}</h4>
        <div className="space-y-4">
            {data.map((item, i) => {
                const val = Number(item.value) || 0;
                const percentage = total > 0 ? Math.round((val / total) * 100) : 0;
                const widthPercent = maxVal > 0 ? (val / maxVal) * 100 : 0;
                const color = item.color || COLORS[i % COLORS.length];

                return (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span>{item.label}</span>
                            <span>PKR {val.toLocaleString()} <span className="opacity-60 font-normal">({percentage}%)</span></span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${widthPercent}%`, backgroundColor: color }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{labels.grant}</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">PKR {Number(grant).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{labels.total}</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">PKR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{labels.balance}</span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">PKR {Number(balance).toLocaleString()}</span>
            </div>
        </div>
    </div>
  );
};

const ComparisonChart = ({ budgets, labels }: { budgets: any[], labels: { grant: string, expenditure: string, balance: string } }) => {
  // Sort by date ascending for the chart (oldest to newest)
  const sortedBudgets = [...budgets].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  const data = sortedBudgets.map(b => {
    const totalExp = b.expenditure_data?.reduce((acc: number, item: any) => acc + (Number(item.value) || 0), 0) || 0;
    return {
      title: new Date(b.created_at).getFullYear().toString(),
      grant: Number(b.total_grant) || 0,
      expenditure: totalExp,
      balance: Number(b.amount_balance) || 0
    };
  });

  const allValues = data.flatMap(d => [d.grant, d.expenditure, d.balance]);
  const maxValue = Math.max(...allValues, 1);

  if (data.length === 0) return <div className="text-center py-10 text-slate-400">No data for comparison.</div>;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-x-auto shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-8">Budget Comparison (Year over Year)</h3>
      
      <div className="min-w-[600px]">
        <div className="flex items-end gap-4 md:gap-12 h-80 pb-4 border-b border-slate-200 dark:border-slate-700">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex items-end justify-center gap-1 md:gap-3 h-full group relative">
               {/* Grant Bar */}
               <div className="w-full max-w-[30px] md:max-w-[50px] bg-emerald-500 rounded-t-lg transition-all hover:opacity-80 relative group/bar" style={{ height: `${(item.grant / maxValue) * 100}%` }}>
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                   {labels.grant}: {item.grant.toLocaleString()}
                 </div>
               </div>
               {/* Expenditure Bar */}
               <div className="w-full max-w-[30px] md:max-w-[50px] bg-blue-500 rounded-t-lg transition-all hover:opacity-80 relative group/bar" style={{ height: `${(item.expenditure / maxValue) * 100}%` }}>
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                   {labels.expenditure}: {item.expenditure.toLocaleString()}
                 </div>
               </div>
               {/* Balance Bar */}
               <div className="w-full max-w-[30px] md:max-w-[50px] bg-amber-500 rounded-t-lg transition-all hover:opacity-80 relative group/bar" style={{ height: `${(item.balance / maxValue) * 100}%` }}>
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                   {labels.balance}: {item.balance.toLocaleString()}
                 </div>
               </div>
               
               <div className="absolute -bottom-8 text-xs font-bold text-slate-500 dark:text-slate-400">{item.title}</div>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{labels.grant}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{labels.expenditure}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{labels.balance}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export const Budget: React.FC<BudgetProps> = ({ language }) => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');
  const t = translations[language];
  const isRtl = t.dir === 'rtl';

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedYear) params.append('year', selectedYear);
        if (searchQuery) params.append('search', searchQuery);
        const url = `${API_BASE_URL}/api/budget/list/?${params.toString()}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setBudgets(data);
        }
      } catch (error) {
        console.error("Failed to fetch budgets", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchBudgets();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedYear, searchQuery]);

  const getLocalized = (item: any, field: string) => {
    if (language === Language.UR) return item[`${field}_ur`] || item[`${field}_en`];
    if (language === Language.SD) return item[`${field}_sd`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  const downloadCSV = () => {
    if (budgets.length === 0) return;

    const headers = ['Title', 'Date', 'Total Grant', 'Total Expenditure', 'Balance', 'Description'];
    const rows = budgets.map(budget => {
      const totalExp = budget.expenditure_data?.reduce((acc: number, item: any) => acc + (Number(item.value) || 0), 0) || 0;
      return [
        `"${getLocalized(budget, 'title').replace(/"/g, '""')}"`,
        new Date(budget.created_at).toLocaleDateString(),
        budget.total_grant || 0,
        totalExp,
        budget.amount_balance || 0,
        `"${getLocalized(budget, 'description').replace(/<[^>]+>/g, '').replace(/"/g, '""')}"` // Strip HTML tags
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `budget_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4">
          <DollarSign size={32} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {t.budgetTitle}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t.budgetDesc}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} size={20} />
          <input 
            type="text" 
            placeholder={t.search || 'Search...'} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium shadow-sm`}
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-auto">
            <Filter className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} size={18} />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={`w-full md:w-auto appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-8'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium cursor-pointer`}
            >
              <option value="">All Years</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex shrink-0">
              <button onClick={() => setViewMode('cards')} className={`p-2 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`} title="Card View">
                  <LayoutGrid size={20} />
              </button>
              <button onClick={() => setViewMode('comparison')} className={`p-2 rounded-lg transition-all ${viewMode === 'comparison' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`} title="Comparison View">
                  <TrendingUp size={20} />
              </button>
              <button onClick={downloadCSV} className="p-2 rounded-lg transition-all text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-700" title="Export CSV">
                  <Download size={20} />
              </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      ) : budgets.length > 0 ? (
        viewMode === 'comparison' ? (
          <ComparisonChart 
            budgets={budgets} 
            labels={{ grant: t.totalGrant || 'Total Grant', expenditure: t.totalExpenditure, balance: t.balance || 'Balance' }} 
          />
        ) : (
        <>
        <div className="flex justify-center mb-8">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex">
                <button onClick={() => setChartType('pie')} className={`p-2 rounded-lg transition-all ${chartType === 'pie' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    <PieChartIcon size={20} />
                </button>
                <button onClick={() => setChartType('bar')} className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    <BarChartIcon size={20} />
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {budgets.map((budget) => (
            <div key={budget.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col">
              <div className="p-8 flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(budget.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-4 leading-tight">
                  {getLocalized(budget, 'title')}
                </h3>
                
                <div 
                  className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-400 mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: getLocalized(budget, 'description') }}
                />

                {budget.expenditure_data && Array.isArray(budget.expenditure_data) && budget.expenditure_data.length > 0 && (
                  chartType === 'pie' ? (
                    <PieChart 
                      data={budget.expenditure_data} 
                      labels={{ breakdown: t.expenditureBreakdown, total: t.totalExpenditure, grant: t.totalGrant || 'Total Grant', balance: t.balance || 'Balance' }} 
                      grant={budget.total_grant || 0}
                      balance={budget.amount_balance || 0}
                    />
                  ) : (
                    <BarChart 
                      data={budget.expenditure_data} 
                      labels={{ breakdown: t.expenditureBreakdown, total: t.totalExpenditure, grant: t.totalGrant || 'Total Grant', balance: t.balance || 'Balance' }} 
                      grant={budget.total_grant || 0}
                      balance={budget.amount_balance || 0}
                    />
                  )
                )}
              </div>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                {budget.file && (
                  <a 
                    href={budget.file.startsWith('http') ? budget.file : `${API_BASE_URL}${budget.file}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                  >
                    <Eye size={18} />
                    {t.viewFile}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
        )
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t.noBudgets}</p>
        </div>
      )}
    </div>
  );
};