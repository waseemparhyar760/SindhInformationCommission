
import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, ExternalLink, FileText } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface CareersProps {
  language: Language;
}

export const Careers: React.FC<CareersProps> = ({ language }) => {
  const t = translations[language];
  const isRtl = t.dir === 'rtl';
  const [careers, setCareers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/careers/list/`);
        if (response.ok) {
          setCareers(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch careers", error);
      }
    };
    fetchCareers();
  }, []);

  const getLocalized = (item: any, field: string) => {
    if (language === Language.UR) return item[`${field}_ur`] || item[`${field}_en`];
    if (language === Language.SD) return item[`${field}_sd`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500" dir={t.dir}>
      <div className={`flex items-center gap-4 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-700 dark:text-blue-400">
          <Briefcase size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
            {t.careers || 'Careers'}
          </h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">
            {t.joinTeam || 'Join our team'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.length > 0 ? careers.map((job) => (
          <div key={job.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">{getLocalized(job, 'title')}</h3>
              {job.is_active && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <Briefcase size={16} /> {job.department}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <MapPin size={16} /> {job.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <Calendar size={16} /> Deadline: {job.deadline}
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 line-clamp-3">
              {getLocalized(job, 'description')}
            </p>

            <div className="flex gap-4">
              {job.file && (
                <a 
                  href={job.file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <FileText size={16} /> Details
                </a>
              )}
              {job.link && (
                <a 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Apply Now <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 text-slate-400 font-medium">
            No career opportunities available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};