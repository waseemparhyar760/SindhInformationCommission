import React, { useState, useEffect } from 'react';
import { Language, AppView } from '../types.ts';
import { translations } from '../i18n.ts';
import { Building } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface AboutProps {
  language: Language;
}

interface Organogram {
  id: number;
  title_en: string;
  title_ur: string;
  title_sd: string;
  image: string;
}

export const About: React.FC<AboutProps> = ({ language }) => {
  const [organogram, setOrganogram] = useState<Organogram | null>(null);
  const t = translations[language];
  const isRtl = t.dir === 'rtl';

  useEffect(() => {
    const fetchOrganogram = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/about/organogram/`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setOrganogram(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch organogram", error);
      }
    };
    fetchOrganogram();
  }, []);

  const getLocalizedTitle = () => {
    if (!organogram) return '';
    if (language === Language.UR) return organogram.title_ur || organogram.title_en;
    if (language === Language.SD) return organogram.title_sd || organogram.title_en;
    return organogram.title_en;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500" dir={t.dir}>
      <div className={`flex items-center gap-4 mb-8`}>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-700 dark:text-blue-400">
          <Building size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
            {t[AppView.ABOUT] || 'About Us'}
          </h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">
            {t.organogramTitle || 'Organogram'}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        {organogram ? (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-6 text-center">
              {getLocalizedTitle()}
            </h3>
            <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
               <img 
                 src={organogram.image.startsWith('http') ? organogram.image : `${API_BASE_URL}${organogram.image}`} 
                 alt={getLocalizedTitle()} 
                 className="w-full h-auto object-contain"
               />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 font-medium">
            Loading organogram...
          </div>
        )}
      </div>
    </div>
  );
};