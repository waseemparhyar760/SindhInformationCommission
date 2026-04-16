
import React, { useState, useEffect } from 'react';
import { Download, Book, FileText, ExternalLink, Scale, FileDown } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface ResourcesProps {
  language: Language;
}

const ResourceCard = ({ title, description, icon: Icon, isRtl, files }: any) => (
  <div className={`bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full group transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 ${isRtl ? 'items-end text-right' : 'items-start text-left'}`}>
    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
      <Icon className="text-blue-700 dark:text-blue-400 group-hover:text-white" size={28} />
    </div>
    <h3 className={`text-xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight w-full`}>{title}</h3>
    <p className={`text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed w-full`}>{description}</p>
    
    <div className={`flex flex-wrap gap-2 w-full ${isRtl ? 'flex-row-reverse' : ''}`}>
      {files?.file_en && (
        <a href={files.file_en} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all">
          <span className="font-sans">EN</span>
          <Download size={14} />
        </a>
      )}
      {files?.file_ur && (
        <a href={files.file_ur} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all">
          <span className="font-ur">UR</span>
          <Download size={14} />
        </a>
      )}
      {files?.file_sd && (
        <a href={files.file_sd} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all">
          <span className="font-sd">SD</span>
          <Download size={14} />
        </a>
      )}
      {!files?.file_en && !files?.file_ur && !files?.file_sd && (
        <div className="w-full py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 rounded-xl">Not Available</div>
      )}
    </div>
  </div>
);

export const Resources: React.FC<ResourcesProps> = ({ language }) => {
  const t = translations[language];
  const isRtl = t.dir === 'rtl';
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resources/list/`);
        if (response.ok) {
          const data = await response.json();
          setResources(data);
        }
      } catch (error) {
        console.error("Failed to fetch resources", error);
      }
    };
    fetchResources();
  }, []);

  const getFile = (type: string) => resources.find(r => r.resource_type === type);

  return (
    <div className="space-y-16 animate-in fade-in duration-500" dir={t.dir}>
      {/* Legal Framework Section */}
      <section>
        <div className={`flex items-center gap-5 mb-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Scale className="text-blue-700 dark:text-blue-400" size={28} />
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">{t.resourcesTitle}</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">{t.resourcesSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ResourceCard 
            title={t.actTitle}
            description={t.actDesc}
            icon={Book}
            isRtl={isRtl}
            files={getFile('ACT')}
          />
          <ResourceCard 
            title={t.rulesTitle}
            description={t.rulesDesc}
            icon={FileText}
            isRtl={isRtl}
            files={getFile('RULES')}
          />
          <ResourceCard 
            title={t.guideTitle}
            description={t.guideDesc}
            icon={Book}
            isRtl={isRtl}
            files={getFile('GUIDE')}
          />
        </div>
      </section>

      {/* Prescribed Forms Section */}
      <section>
        <div className={`flex items-center gap-5 mb-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <FileText className="text-indigo-700 dark:text-indigo-400" size={28} />
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">{t.formsTitle}</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">{t.formsSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ResourceCard 
            title={t.formATitle}
            description={t.formADesc}
            icon={Download}
            isRtl={isRtl}
            files={getFile('FORM_A')}
          />
          <ResourceCard 
            title={t.formBTitle}
            description={t.formBDesc}
            icon={Download}
            isRtl={isRtl}
            files={getFile('FORM_B')}
          />
          <ResourceCard 
            title={t.formCTitle}
            description={t.formCDesc}
            icon={Download}
            isRtl={isRtl}
            files={getFile('FORM_C')}
          />
        </div>
      </section>

      {/* Physical Copy Section */}
      <section className="bg-slate-50 dark:bg-slate-950 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className={`flex flex-col md:flex-row items-center justify-between relative z-10 gap-10 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
          <div className={`md:max-w-xl w-full ${isRtl ? 'text-right' : 'text-left'}`}>
            <h3 className="text-3xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">{t.physicalCopyTitle}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
              {t.physicalCopyDesc}
            </p>
          </div>
          <a 
            href="https://maps.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-4 bg-amber-400 text-slate-950 px-10 py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-300 transition-all shadow-xl hover:-translate-y-1 active:scale-95 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <span>{t.getDirections}</span>
            <ExternalLink size={20} className={isRtl ? 'rotate-180' : ''} />
          </a>
        </div>
      </section>
    </div>
  );
};
