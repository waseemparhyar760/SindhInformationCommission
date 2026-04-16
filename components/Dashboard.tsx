
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar,
  User,
  ShieldCheck,
  Award,
  X,
  Info,
  Scale,
  Target,
  FileText,
  Search,
  GraduationCap,
  Mail,
  Phone,
  Bell,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { Location } from './Location.tsx';
import { GalleryApp } from './GalleryApp.tsx';
import { API_BASE_URL } from '../config';

interface DashboardProps {
  language: Language;
  onViewAllHearings?: () => void;
  onViewAllEvents?: () => void;
  onViewAnnualReports?: () => void;
  onOpenEventPage?: (eventId: number) => void;
}

const HighlightText = ({ text, highlight }: { text: string | number | null | undefined, highlight: string }) => {
  const strText = String(text || '');
  if (!highlight.trim()) return <>{strText}</>;
  
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = strText.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-slate-900 dark:text-white rounded px-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const CommissionerCard = ({ name, title, isChief, isRtl, onClick, helperText, imageUrl }: any) => (
  <button 
    onClick={onClick}
    className={`relative text-start bg-white dark:bg-slate-900 p-6 rounded-3xl border ${isChief ? 'border-blue-200 dark:border-blue-800 ring-4 ring-blue-500/5' : 'border-slate-100 dark:border-slate-800'} transition-all hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-400 group overflow-hidden w-full`}
  >
    {isChief && (
      <div className={`absolute top-0 ltr:right-0 rtl:left-0 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl rounded-tr-none z-10 shadow-sm`}>
        Lead
      </div>
    )}
    <div className={`flex items-center gap-5`}>
      <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 border-2 ${isChief ? 'border-blue-100 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/40 shadow-inner' : 'border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800'}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          isChief ? <ShieldCheck className="text-blue-700 dark:text-blue-400" size={32} /> : <User className="text-slate-500 dark:text-slate-400" size={32} />
        )}
      </div>
      <div className="flex-1">
        <h4 className={`text-lg font-black text-slate-800 dark:text-slate-100 leading-tight mb-1`}>{name}</h4>
        <div className={`flex items-center gap-1.5`}>
          {isChief && <Award size={14} className="text-amber-500" />}
          <p className={`text-xs font-bold uppercase tracking-widest ${isChief ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {title}
          </p>
        </div>
      </div>
    </div>
    <div className={`mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors group-hover:text-blue-500`}>
      <Info size={12} />
      {helperText}
    </div>
  </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ language, onViewAllHearings, onViewAllEvents, onViewAnnualReports, onOpenEventPage }) => {
  const t = translations[language];
  const isRtl = t.dir === 'rtl';
  const [selectedCommissioner, setSelectedCommissioner] = useState<any>(null);
  const [commissioners, setCommissioners] = useState<any[]>([]);
  const [hearings, setHearings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [causeLists, setCauseLists] = useState<any[]>([]);
  const [actFile, setActFile] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [overviewList, setOverviewList] = useState<any[]>([]);
  const [selectedOverview, setSelectedOverview] = useState<any>(null);
  const [selectedCauseList, setSelectedCauseList] = useState<any>(null);
  const [causeListSearchTerm, setCauseListSearchTerm] = useState('');
  const overviewScrollRef = useRef<HTMLDivElement>(null);
  const [showModalHeader, setShowModalHeader] = useState(false);

  useEffect(() => {
    const fetchCommissioners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/commissioners/list/`);
        if (response.ok) {
          const data = await response.json();
          setCommissioners(data);
        }
      } catch (error) {
        console.error("Failed to fetch commissioners", error);
      }
    };
    fetchCommissioners();

    const fetchHearings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/complaint/hearings/`);
        if (response.ok) {
          const data = await response.json();
          const now = new Date();
          const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
          const upcoming = data.filter((h: any) => h.hearing_date >= todayStr);
          setHearings(upcoming);
        }
      } catch (error) {
        console.error("Failed to fetch hearings", error);
      }
    };
    fetchHearings();

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/list/`);
        if (response.ok) {
          setNotifications(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();

    const fetchCauseLists = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cause-list/list/`);
        if (response.ok) {
          setCauseLists(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch cause lists", error);
      }
    };
    fetchCauseLists();

    const fetchAct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/acts/list/`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setActFile(data[0].pdf_file);
          }
        }
      } catch (error) {
        console.error("Failed to fetch act", error);
      }
    };
    fetchAct();

    const fetchOverview = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/commission-overview/active/`);
        if (response.ok) {
          const data = await response.json();
          if (data) setOverviewList(data);
        }
      } catch (error) {
        console.error("Failed to fetch overview", error);
      }
    };
    fetchOverview();
  }, []);

  useEffect(() => {
    if (selectedCommissioner) {
      setShowModalHeader(false);
    }
  }, [selectedCommissioner]);

  const getLocalized = (item: any, field: string) => {
    if (language === Language.UR) return item[`${field}_ur`] || item[`${field}_en`];
    if (language === Language.SD) return item[`${field}_sd`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  const handleReadAct = () => {
    if (actFile) {
      const url = actFile.startsWith('http') ? actFile : `${API_BASE_URL}${actFile}`;
      setPreviewUrl(url);
    }
  };

  const scrollOverview = (direction: 'left' | 'right') => {
    if (overviewScrollRef.current) {
      const { current } = overviewScrollRef;
      const scrollAmount = current.clientWidth;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
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

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Gallery Section */}
      <GalleryApp language={language} onViewAll={onViewAllEvents} onOpenEventPage={onOpenEventPage} />

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className={`flex items-center gap-3 mb-6`}>
             <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
               <Bell size={20} />
             </div>
             <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
               {t.latestUpdates}
             </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notifications.map((note) => (
              <div key={note.id} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${note.notification_type === 'event' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                    {note.notification_type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(note.event_date || note.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">{getLocalized(note, 'title')}</h4>
                {getLocalized(note, 'description') && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{getLocalized(note, 'description')}</p>
                )}
                {(note.file || note.link) && (
                  <a href={note.file || note.link} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                    View Details <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comprehensive Details Section */}
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      {overviewList.length > 0 ? (
        <div className="relative group">
          {overviewList.length > 1 && (
            <>
              <button
                onClick={() => scrollOverview('left')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-white shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-700"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scrollOverview('right')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-white shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-700"
                aria-label="Scroll Right"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div ref={overviewScrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide">
          {overviewList.map((overview, index) => (
            <section key={overview.id || index} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden snap-center shrink-0 w-full h-[550px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-e border-slate-100 dark:border-slate-800 flex flex-col h-full relative">
                <div className={`flex items-center gap-3 mb-6 shrink-0`}>
                   <div className="h-8 w-1.5 bg-blue-700 rounded-full"></div>
                   <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
                     {getLocalized(overview, 'title')}
                   </h3>
                </div>
                <div className="relative flex-1 overflow-hidden">
                  <div 
                    className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: getLocalized(overview, 'description') }}
                  />
                </div>
                <button 
                  onClick={() => setSelectedOverview(overview)}
                  className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs hover:gap-3 transition-all shrink-0 w-fit"
                >
                  Read More <ChevronRight size={16} className={isRtl ? 'rotate-180' : ''} />
                </button>
              </div>
              <div className={`bg-slate-50 dark:bg-slate-950 relative overflow-hidden ${index === 0 ? 'p-8 md:p-12 flex flex-col justify-center' : ''}`}>
                {overview.image ? (
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={overview.image.startsWith('http') ? overview.image : `${API_BASE_URL}${overview.image}`} 
                      alt="Overview" 
                      className={`w-full h-full object-cover ${index === 0 ? 'opacity-10 dark:opacity-20' : 'opacity-100'}`} 
                    />
                    {index === 0 && <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 dark:to-transparent"></div>}
                  </div>
                ) : (
                  <div className="absolute top-[-20%] ltr:right-[-10%] rtl:left-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
                )}
                
                {index === 0 && (
                  <div className="relative z-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">{t.heroTitle}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed text-lg font-medium">
                      {t.heroDesc}
                    </p>
                    <div className={`flex flex-wrap gap-4`}>
                      <button 
                        onClick={handleReadAct}
                        className="bg-amber-400 text-slate-950 px-8 py-3.5 rounded-2xl font-black hover:bg-amber-300 transition-all shadow-xl text-sm uppercase tracking-widest"
                      >
                        {t.readAct}
                      </button>
                      <button 
                        onClick={onViewAnnualReports}
                        className="bg-white dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/20 px-8 py-3.5 rounded-2xl font-black hover:bg-slate-100 dark:hover:bg-white/20 transition-all text-sm uppercase tracking-widest"
                      >
                        {t.reports}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
          ))}
          </div>
        </div>
      ) : (
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-e border-slate-100 dark:border-slate-800">
              <div className={`flex items-center gap-3 mb-6`}>
                 <div className="h-8 w-1.5 bg-blue-700 rounded-full"></div>
                 <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
                   {t.commissionOverview}
                 </h3>
              </div>
              <div className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
                {t.overviewText}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-[-20%] ltr:right-[-10%] rtl:left-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">{t.heroTitle}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed text-lg font-medium">
                  {t.heroDesc}
                </p>
                <div className={`flex flex-wrap gap-4`}>
                  <button 
                    onClick={handleReadAct}
                    className="bg-amber-400 text-slate-950 px-8 py-3.5 rounded-2xl font-black hover:bg-amber-300 transition-all shadow-xl text-sm uppercase tracking-widest"
                  >
                    {t.readAct}
                  </button>
                  <button 
                    onClick={onViewAnnualReports}
                    className="bg-white dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/20 px-8 py-3.5 rounded-2xl font-black hover:bg-slate-100 dark:hover:bg-white/20 transition-all text-sm uppercase tracking-widest"
                  >
                    {t.reports}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Leadership Section */}
      <section>
        <div className={`flex items-center gap-3 mb-8`}>
           <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
           <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
             {t.leadershipTitle}
           </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commissioners.map((comm) => (
            <CommissionerCard 
              key={comm.id}
              name={getLocalized(comm, 'name')} 
              title={getLocalized(comm, 'title')} 
              isChief={comm.isChief} 
              isRtl={isRtl} 
              onClick={() => setSelectedCommissioner(comm)}
              helperText={t.viewDetails}
              imageUrl={comm.imageUrl}
            />
          ))}
        </div>
      </section>

      {/* Overview Modal */}
      {selectedOverview && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300 pointer-events-none"
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row relative pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            dir={t.dir}
          >
             <button 
                  onClick={() => setSelectedOverview(null)}
                  className="absolute top-6 right-6 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all z-50 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <X size={24} />
            </button>

            {selectedOverview.image && (
                <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0 bg-slate-100 dark:bg-slate-950">
                    <img 
                      src={selectedOverview.image.startsWith('http') ? selectedOverview.image : `${API_BASE_URL}${selectedOverview.image}`} 
                      alt="Overview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r"></div>
                </div>
            )}

            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className={`flex items-center gap-3 mb-6`}>
                   <div className="h-8 w-1.5 bg-blue-700 rounded-full"></div>
                   <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
                     {getLocalized(selectedOverview, 'title')}
                   </h3>
                </div>
                <div 
                  className="prose dark:prose-invert max-w-none text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: getLocalized(selectedOverview, 'description') }}
                />
            </div>
          </div>
        </div>
      )}

      {/* detail Modal - No Dimmed Background, No Blur */}
      {selectedCommissioner && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300 pointer-events-none"
          onClick={() => setSelectedCommissioner(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 pointer-events-auto flex flex-col md:flex-row-reverse relative"
            dir={t.dir}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Positioned based on layout direction */}
            <button 
              onClick={() => setSelectedCommissioner(null)}
              className={`absolute top-6 z-50 p-3 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 ${isRtl ? 'left-6' : 'right-6'}`}
            >
              <X size={22} />
            </button>

            {/* Image Section - Takes 40% width on desktop */}
            <div className="w-full md:w-5/12 h-72 md:h-auto relative shrink-0 bg-slate-100 dark:bg-slate-800">
                {selectedCommissioner.imageUrl ? (
                  <img src={selectedCommissioner.imageUrl} alt={selectedCommissioner.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                    {selectedCommissioner.isChief ? <ShieldCheck className="text-blue-700 dark:text-blue-400 opacity-20" size={120} /> : <User className="text-slate-500 dark:text-slate-400 opacity-20" size={120} />}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/5 pointer-events-none"></div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 relative">
                {/* Sticky Header on Scroll */}
                <div className={`absolute top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 py-4 transition-all duration-300 transform ${showModalHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} ${isRtl ? 'pr-6 pl-20 md:pr-20 md:pl-6' : 'pl-6 pr-20 md:pl-20 md:pr-6'}`}>
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 truncate leading-tight">{getLocalized(selectedCommissioner, 'name')}</h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{getLocalized(selectedCommissioner, 'title')}</p>
                </div>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onScroll={(e) => setShowModalHeader(e.currentTarget.scrollTop > 60)}>
                <div className="mt-4 md:mt-0 text-start">
                  <div className={`flex items-center gap-3 mb-3`}>
                    {selectedCommissioner.isChief && <Award size={28} className="text-amber-500 shrink-0" />}
                    <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">{getLocalized(selectedCommissioner, 'name')}</h3>
                  </div>
                  <p className={`text-sm font-black uppercase tracking-[0.2em] mb-8 ${selectedCommissioner.isChief ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {getLocalized(selectedCommissioner, 'title')}
                  </p>
                  
                  <div className="space-y-4 mb-10">
                    {getLocalized(selectedCommissioner, 'education') && (
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <GraduationCap size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Education</span>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{getLocalized(selectedCommissioner, 'education')}</span>
                        </div>
                      </div>
                    )}
                    {(selectedCommissioner.email || selectedCommissioner.contact_number) && (
                    <div className="flex flex-wrap gap-4">
                    {selectedCommissioner.email && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Mail size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedCommissioner.email}</span>
                      </div>
                    )}
                    {selectedCommissioner.contact_number && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Phone size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedCommissioner.contact_number}</span>
                      </div>
                    )}
                    </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} /> Professional Bio
                    </h4>
                    <div className="prose dark:prose-invert max-w-none">
                        <div 
                            className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium"
                            dangerouslySetInnerHTML={{ __html: getLocalized(selectedCommissioner, 'bio') }}
                        />
                    </div>
                  </div>
                </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Cause List Section */}
      {causeLists.length > 0 && (
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <div className={`flex items-center gap-3 mb-8`}>
             <div className="h-6 w-1 bg-emerald-500 rounded-full"></div>
             <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
               {t.causeListTitle}
             </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {causeLists.map((list) => {
              const hasHearings = list.hearings && list.hearings.length > 0;
              return (
              <div 
                key={list.id} 
                onClick={() => {
                  if (hasHearings) setSelectedCauseList(list);
                  setCauseListSearchTerm('');
                }}
                className={`flex flex-col p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group ${hasHearings ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/40 p-3 rounded-xl text-emerald-700 dark:text-emerald-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight mb-1">{getLocalized(list, 'title')}</h4>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{new Date(list.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {list.file && (
                    <a href={list.file.startsWith('http') ? list.file : `${API_BASE_URL}${list.file}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-3 bg-white dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-colors shadow-sm">
                      <Download size={18} />
                    </a>
                  )}
                </div>
                {hasHearings && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    {list.hearings.map((hearing: any) => (
                      <div key={hearing.id} className="text-xs">
                        <p className="font-bold text-slate-700 dark:text-slate-200"><span className="font-black text-emerald-600 dark:text-emerald-400">{hearing.serial_number || '•'}.</span> {hearing.complaint_display}</p>
                        <p className="text-slate-500 dark:text-slate-400 pl-4">{hearing.complainant_name} vs {hearing.respondent_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )})}
          </div>
        </section>
      )}

      {/* Hearings Section */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className={`flex items-center gap-3 mb-8`}>
           <div className="h-6 w-1 bg-amber-500 rounded-full"></div>
           <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
             {t.hearings}
           </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hearings.length > 0 ? hearings.map((hearing) => {
            const date = new Date(hearing.hearing_date);
            const month = date.toLocaleString('default', { month: 'short' });
            const day = date.getDate();
            
            let time = 'TBD';
            if (hearing.hearing_time) {
              const [hours, minutes] = hearing.hearing_time.split(':');
              time = new Date(0, 0, 0, parseInt(hours), parseInt(minutes)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            }

            return (
            <div key={hearing.id} className={`flex items-start gap-5 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all group`}>
              <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-2xl text-blue-700 dark:text-blue-400 flex flex-col items-center min-w-[70px] shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{month}</span>
                <span className="text-2xl font-black">{day}</span>
              </div>
              <div className="text-start">
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">
                  {hearing.complaint_number && hearing.complaint_year ? `Complaint No. (${hearing.complaint_number}/${hearing.complaint_year})` : 'Complaint No. (Pending)'}
                </h4>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">{hearing.complainant_name} <span className="text-blue-600 dark:text-blue-400">Vs.</span> {hearing.respondent_name}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                  <Calendar size={12} className="mx-1.5" /> {time}
                </span>
                {hearing.complaint_procedural_status && (
                  <div className="mt-2">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{hearing.complaint_procedural_status}</span>
                  </div>
                )}
              </div>
            </div>
          )}) : (
            <div className="col-span-full text-center py-10 text-slate-400 font-medium">No upcoming hearings scheduled.</div>
          )}
        </div>
        <button 
          onClick={onViewAllHearings}
          className="w-full mt-10 py-4 text-blue-700 dark:text-blue-400 font-black text-xs uppercase tracking-[0.3em] bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-95 border border-blue-100/50 dark:border-blue-800/50"
        >
          {t.viewAll}
        </button>
      </section>

      {/* Cause List Modal */}
      {selectedCauseList && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300 pointer-events-none"
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
             <button 
                  onClick={() => setSelectedCauseList(null)}
                  className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all z-50"
                >
                  <X size={24} />
            </button>

            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="text-center mb-10">
                    <div className="inline-block mb-4">
                        <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full mb-2"></div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{t.causeListHeader}</h2>
                    <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{t.causeListDatePrefix} {formatDate(selectedCauseList.date)}</h3>
                </div>

                <div className="mb-6 relative max-w-xl mx-auto">
                  <input
                    type="text"
                    placeholder={t.causeListSearchPlaceholder}
                    value={causeListSearchTerm}
                    onChange={(e) => setCauseListSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-black">{t.serialNo}</th>
                                <th scope="col" className="px-6 py-4 font-black">{t.complaintNoCol}</th>
                                <th scope="col" className="px-6 py-4 font-black">{t.timeCol}</th>
                                <th scope="col" className="px-6 py-4 font-black">{t.partiesCol}</th>
                                <th scope="col" className="px-6 py-4 font-black">{t.remarksCol}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {selectedCauseList.hearings.filter((hearing: any) => {
                                if (!causeListSearchTerm) return true;
                                const term = causeListSearchTerm.toLowerCase();
                                return (
                                  (hearing.serial_number?.toString().toLowerCase().includes(term)) ||
                                  (hearing.complaint_display?.toLowerCase().includes(term)) ||
                                  (hearing.complainant_name?.toLowerCase().includes(term)) ||
                                  (hearing.respondent_name?.toLowerCase().includes(term)) ||
                                  (hearing.department?.toLowerCase().includes(term))
                                );
                            }).map((hearing: any, index: number) => (
                                <tr key={hearing.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                                      <HighlightText text={hearing.serial_number || index + 1} highlight={causeListSearchTerm} />
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                      <HighlightText text={hearing.complaint_display} highlight={causeListSearchTerm} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {new Date(`1970-01-01T${hearing.hearing_time}`).toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true})}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 dark:text-slate-100">
                                          <HighlightText text={hearing.complainant_name} highlight={causeListSearchTerm} />
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest my-1">{t.vsLabel}</div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">
                                          <HighlightText text={hearing.respondent_name} highlight={causeListSearchTerm} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Act Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.actTitle}</h3>
              <button onClick={() => setPreviewUrl(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
              <iframe src={previewUrl} className="w-full h-full" title="Act Preview" />
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
              <a href={previewUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Download size={18} /> {t.downloadPdfLabel}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Location Section */}
      <Location language={language} />
    </div>
  );
};
