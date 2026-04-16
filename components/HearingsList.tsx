
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, Search } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface HearingsListProps {
  language: Language;
  onBack: () => void;
}

export const HearingsList: React.FC<HearingsListProps> = ({ language, onBack }) => {
  const t = translations[language];
  const isRtl = t.dir === 'rtl';
  const [hearings, setHearings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHearings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/complaint/hearings/`);
        if (response.ok) {
          setHearings(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch hearings", error);
      }
    };
    fetchHearings();
  }, []);

  const filteredHearings = hearings.filter(hearing => {
    const query = searchQuery.toLowerCase();
    return (
      (hearing.complaint_number && String(hearing.complaint_number).toLowerCase().includes(query)) ||
      (hearing.complainant_name && hearing.complainant_name.toLowerCase().includes(query)) ||
      (hearing.respondent_name && hearing.respondent_name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir={t.dir}>
      <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={onBack}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} className={`text-slate-600 dark:text-slate-300 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">{t.allHearings}</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">{t.hearingsSubtitle}</p>
        </div>
      </div>

      <div className="relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} size={20} />
        <input 
          type="text" 
          placeholder="Search by Complaint No, Name or Department..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 dark:text-slate-200 shadow-sm`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHearings.length > 0 ? filteredHearings.map((hearing) => {
          const date = new Date(hearing.hearing_date);
          const month = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const year = date.getFullYear();
          const [hours, minutes] = hearing.hearing_time.split(':');
          const time = new Date(0, 0, 0, parseInt(hours), parseInt(minutes)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

          return (
            <div key={hearing.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
              <div className={`flex items-start gap-5`}>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-blue-700 dark:text-blue-400 flex flex-col items-center min-w-[80px] border border-blue-100 dark:border-blue-800/50">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{month} '{year.toString().slice(2)}</span>
                  <span className="text-3xl font-black">{day}</span>
                </div>
                <div className="flex-1 text-start">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-3">
                    <Calendar size={12} className="mx-1.5" /> {time}
                  </div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight mb-2">
                    {hearing.complaint_number && hearing.complaint_year ? `Complaint No. (${hearing.complaint_number}/${hearing.complaint_year})` : 'Complaint No. (Pending)'}
                  </h4>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Complainant:</span> {hearing.complainant_name}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Respondent:</span> {hearing.respondent_name}
                    </p>
                  </div>
                  {hearing.complaint_procedural_status && (
                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-lg">{hearing.complaint_procedural_status}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full text-center py-20 text-slate-400 font-medium">No hearings found.</div>
        )}
      </div>
    </div>
  );
};