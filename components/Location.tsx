import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';

interface LocationProps {
  language: Language;
}

export const Location: React.FC<LocationProps> = ({ language }) => {
  const t = translations[language];
  const isRtl = t.dir === 'rtl';

  return (
    <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-[450px]:p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="mb-8">
        <div className={`flex items-center gap-3 mb-3`}>
           <div className="h-8 w-1.5 bg-red-500 rounded-full shrink-0"></div>
           <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
             {t.locationTitle}
           </h3>
        </div>
        <p className={`text-sm font-bold text-slate-500 dark:text-slate-400 ${isRtl ? 'pr-5 max-[450px]:pr-0' : 'pl-5 max-[450px]:pl-0'}`}>{t.headOfficeAddress}</p>
        
        <div className={`flex flex-col md:flex-row gap-6 mt-6 ${isRtl ? 'pr-5 max-[450px]:pr-0' : 'pl-5 max-[450px]:pl-0'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
              <Phone size={18} />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">021-99204641</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 shrink-0">
              <Mail size={18} />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 break-all">sindhinformationcommission@gmail.com</span>
          </div>
        </div>
      </div>
      <div className="w-full h-[450px] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner bg-slate-50 dark:bg-slate-800 relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14482.24478044244!2d67.01667422356198!3d24.844675620365376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33d7be7fb94c5%3A0xac1574559d223b12!2sSindh%20Information%20Commission%20RTI!5e0!3m2!1sen!2s!4v1768166379884!5m2!1sen!2s" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        ></iframe>
      </div>
    </section>
  );
};