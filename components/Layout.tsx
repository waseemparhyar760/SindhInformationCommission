import React from 'react';
import { NAV_ITEMS } from '../constants.tsx';
import { AppView, Language } from '../types.ts';
import { WebsiteLogo } from './websiteLogo.tsx';
import { translations } from '../i18n.ts';
import { Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  setActiveView, 
  language, 
  setLanguage,
  isDarkMode,
  toggleTheme
}) => {
  const t = translations[language];

  return (
    <div className={`h-screen flex flex-col ${t.fontClass} bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden`} dir={t.dir}>
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .mobile-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .mobile-scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 shadow-sm transition-colors duration-300 z-40">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <WebsiteLogo className="w-10 h-10 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base truncate">{t.appName}</h1>
                <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold truncate">{t.govtSindh}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={toggleTheme}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>

              <div className="h-9 flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                {[
                  { id: Language.EN, label: 'EN' },
                  { id: Language.SD, label: 'سنڌي' },
                  { id: Language.UR, label: 'اردو' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`px-3 h-full text-[10px] font-black rounded-lg transition-all flex items-center justify-center ${
                      language === lang.id 
                        ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-400 shadow-sm' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex mt-3 items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 ${
                  activeView === item.id
                    ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.icon}
                <span className="text-xs md:text-sm font-semibold">
                  {t[item.id] || item.label}
                </span>
              </button>
            ))}
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth pb-24 lg:pb-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 mobile-scrollbar-hide">
          <div className="p-2 md:p-4 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl lg:hidden">
        <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 min-w-[76px] ${
                activeView === item.id
                  ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.icon}
              <span className="text-[10px] md:text-xs font-semibold leading-tight text-center">
                {t[item.id] || item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
