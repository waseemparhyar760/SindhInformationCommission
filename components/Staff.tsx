
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Briefcase, Info, X, GraduationCap, Award, History } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface StaffProps {
  language: Language;
}

const StaffCard = ({ name, title, department, email, isRtl, onClick, viewDetailsLabel, imageUrl }: any) => (
  <button 
    onClick={onClick}
    className={`bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all flex flex-col gap-6 w-full group ${isRtl ? 'text-right' : 'text-left'}`}
    dir={isRtl ? 'rtl' : 'ltr'}
  >
    <div className={`flex items-center gap-5`}>
      <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-700 dark:text-blue-400 border border-slate-100 dark:border-slate-700 shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <User size={40} />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors tracking-tight">{name}</h4>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">{title}</p>
      </div>
    </div>
    
    <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800/50 w-full">
      <div className={`flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-400`}>
        <Building size={18} className="text-slate-400 shrink-0" />
        <span className="truncate">{department}</span>
      </div>
      <div className={`flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-400`}>
        <Mail size={18} className="text-slate-400 shrink-0" />
        <span className="truncate">{email}</span>
      </div>
    </div>
    
    <div className={`mt-2 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors group-hover:text-blue-500`}>
      <Info size={12} />
      {viewDetailsLabel}
    </div>
  </button>
);

export const Staff: React.FC<StaffProps> = ({ language }) => {
  const t = translations[language];
  const isRtl = t.dir === 'rtl';
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [showModalHeader, setShowModalHeader] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/staff/list/`);
        if (response.ok) {
          const data = await response.json();
          setStaffMembers(data);
        }
      } catch (error) {
        console.error("Failed to fetch staff", error);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    if (selectedStaff) {
      setShowModalHeader(false);
    }
  }, [selectedStaff]);

  const getLocalized = (item: any, field: string) => {
    if (language === Language.UR) return item[`${field}_ur`] || item[`${field}_en`];
    if (language === Language.SD) return item[`${field}_sd`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-500" dir={isRtl ? 'rtl' : 'ltr'}>
      <section>
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12`}>
          <div className={isRtl ? 'text-right' : ''}>
            <div className={`flex items-center gap-4 mb-3`}>
              <div className="h-10 w-2 bg-blue-700 rounded-full shadow-sm"></div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase">
                {t.staffTitle}
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-medium text-lg">
              {t.staffSubtitle}
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-blue-900/30 px-6 py-3 rounded-2xl flex items-center gap-3 text-blue-900 dark:text-blue-400 font-black text-xs uppercase tracking-[0.3em] border border-slate-200 dark:border-blue-800 shadow-sm shrink-0">
            <Briefcase size={16} />
            {staffMembers.length} {t.professionals}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staffMembers.map((member, index) => (
            <StaffCard 
              key={index} 
              name={getLocalized(member, 'name')}
              title={getLocalized(member, 'title')}
              department={getLocalized(member, 'department')}
              email={member.email}
              imageUrl={member.imageUrl}
              isRtl={isRtl}
              viewDetailsLabel={t.viewDetails}
              onClick={() => setSelectedStaff(member)}
            />
          ))}
        </div>
      </section>

      {/* Staff detail Modal */}
      {selectedStaff && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300 pointer-events-none"
          onClick={() => setSelectedStaff(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col relative pointer-events-auto"
            dir={isRtl ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className={`absolute top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 py-4 transition-all duration-300 transform ${showModalHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} ${isRtl ? 'pl-16 pr-6' : 'pr-16 pl-6'}`}>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 truncate leading-tight">{getLocalized(selectedStaff, 'name')}</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{getLocalized(selectedStaff, 'title')}</p>
            </div>

            <button 
              onClick={() => setSelectedStaff(null)}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm border border-slate-200 dark:border-slate-700 z-50`}
            >
              <X size={20} />
            </button>

            <div className="flex-1 flex flex-col md:flex-row-reverse overflow-hidden">
              <div className="shrink-0 p-6 pb-0 md:pb-6 md:pt-16 flex justify-center md:justify-start z-10">
                <div className={`w-32 h-32 rounded-[2rem] overflow-hidden flex items-center justify-center shrink-0 shadow-2xl border-4 border-blue-50 dark:border-blue-900 bg-slate-50 dark:bg-slate-800`}>
                  <img src={selectedStaff.imageUrl} alt={selectedStaff.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div 
                className="flex-1 overflow-y-auto p-6 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                onScroll={(e) => setShowModalHeader(e.currentTarget.scrollTop > 60)}
              >
                <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter mb-1">{getLocalized(selectedStaff, 'name')}</h3>
                  <p className={`text-xs font-black uppercase tracking-[0.3em] mb-4 text-blue-600 dark:text-blue-400`}>
                    {getLocalized(selectedStaff, 'title')}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                     <div className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700`}>
                        <Mail className="text-blue-600 shrink-0" size={16} />
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 truncate">{selectedStaff.email}</span>
                     </div>
                     <div className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700`}>
                        <Phone className="text-blue-600 shrink-0" size={16} />
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-200">{selectedStaff.phone}</span>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className={`flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 border-b border-blue-100 dark:border-blue-900 pb-1`}>
                          <GraduationCap size={14} /> {t.academicBack}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-xs font-bold leading-relaxed">
                          {getLocalized(selectedStaff, 'education')}
                        </p>
                      </div>
                      <div>
                        <h4 className={`flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 border-b border-blue-100 dark:border-blue-900 pb-1`}>
                          <History size={14} /> {t.experience}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-xs font-bold leading-relaxed">
                          {getLocalized(selectedStaff, 'experience')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className={`flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 border-b border-blue-100 dark:border-blue-900 pb-1`}>
                        <User size={14} /> {t.professionalProfile}
                      </h4>
                      <div 
                        className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: getLocalized(selectedStaff, 'bio') }}
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      )}

      <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className={`flex flex-col md:flex-row items-start gap-10 relative z-10`}>
          <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-3xl text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
            <Info size={40} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight uppercase">{t.contactInfo}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed text-lg font-medium">
              {t.staffFooterText}
            </p>
            <div className={`flex flex-wrap gap-6`}>
               <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-700 shadow-sm">
                 {t.complaintsLabel}: feedback@sic.gos.pk
               </div>
               <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-700 shadow-sm">
                 {t.mediaLabel}: press@sic.gos.pk
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
