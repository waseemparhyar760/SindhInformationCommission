import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Download, ExternalLink, FileText, Search } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface Notification {
  id: number;
  title_en: string;
  title_ur: string;
  title_sd: string;
  description_en: string;
  description_ur: string;
  description_sd: string;
  file: string | null;
  link: string | null;
  created_at: string;
}

interface NotificationsProps {
  language: Language;
}

export const Notifications: React.FC<NotificationsProps> = ({ language }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[language];
  const isRtl = t.dir === 'rtl';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notification-app/list/`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getLocalized = (item: any, field: string) => {
    if (language === Language.UR) return item[`${field}_ur`] || item[`${field}_en`] || '';
    if (language === Language.SD) return item[`${field}_sd`] || item[`${field}_en`] || '';
    return item[`${field}_en`] || '';
  };

  const isNew = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    if (language === Language.UR) {
      const months = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
      return `${day} ${months[monthIndex]}، ${year}`;
    }
    if (language === Language.SD) {
      const months = ['جنوري', 'فيبروري', 'مارچ', 'اپريل', 'مئي', 'جون', 'جولاءِ', 'آگسٽ', 'سيپٽمبر', 'آڪٽوبر', 'نومبر', 'ڊسمبر'];
      return `${day} ${months[monthIndex]} ${year}`;
    }
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filteredNotifications = notifications.filter(n => {
    const title = getLocalized(n, 'title').toLowerCase();
    const desc = getLocalized(n, 'description').toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || desc.includes(query);
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-500" dir={t.dir}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
              {t.notificationsTitle || 'Notifications'}
            </h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">
              {t.notificationsSubtitle || 'Official Announcements & Alerts'}
            </p>
          </div>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} size={20} />
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:ring-2 focus:ring-red-500/20 font-bold text-slate-700 dark:text-slate-200 shadow-sm`}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading notifications...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredNotifications.length > 0 ? filteredNotifications.map((note) => (
            <div key={note.id} className="relative bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/50 hover:shadow-xl transition-all duration-300 group overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10 transition-colors"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-6">
                {/* Icon Column */}
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Bell size={24} />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {isNew(note.created_at) && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm animate-pulse">
                        {language === Language.UR ? 'نیا' : language === Language.SD ? 'نئون' : 'New'}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={12} />
                      {formatDate(note.created_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mb-3 leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {getLocalized(note, 'title')}
                  </h3>
                  
                  <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap mb-6">
                    {getLocalized(note, 'description')}
                  </div>

                  <div className="flex flex-wrap gap-3">
                  {note.file && (
                    <a 
                      href={note.file.startsWith('http') ? note.file : `${API_BASE_URL}${note.file}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-600 dark:hover:bg-red-400 hover:text-white transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                      <Download size={16} /> {language === Language.UR ? 'فائل ڈاؤن لوڈ کریں' : language === Language.SD ? 'فائل ڊائون لوڊ ڪريو' : 'Download File'}
                    </a>
                  )}
                  {note.link && (
                    <a 
                      href={note.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all shadow-sm active:scale-95"
                    >
                      <ExternalLink size={16} /> {language === Language.UR ? 'لنک پر جائیں' : language === Language.SD ? 'لنڪ تي وڃو' : 'Visit Link'}
                    </a>
                  )}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <FileText size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No notifications found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
