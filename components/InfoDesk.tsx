
import React, { useState, useEffect } from 'react';
import { Megaphone, Building2, BookOpenCheck, Eye, Newspaper, ArrowRight, ExternalLink, X, FileText, Link as LinkIcon, Search, MapPin, User, Phone, Mail, Copy, Flag, Check, ArrowLeft } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface InfoDeskProps {
  language: Language;
}

const HighlightText = ({ text, highlight }: { text: string | null | undefined, highlight: string }) => {
  if (!text) return null;
  if (!highlight.trim()) return <>{text}</>;
  
  try {
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
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
  } catch (e) {
    return <>{text}</>;
  }
};

const InfoCard = ({ title, description, icon: Icon, isRtl, viewLabel, onClick }: any) => (
  <button onClick={onClick} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all flex flex-col h-full group text-start relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
      <Icon size={28} className="text-blue-700 dark:text-blue-400 group-hover:text-white" />
    </div>
    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">{title}</h3>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">{description}</p>
    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : ''}`}>
      <span>{viewLabel}</span>
      {isRtl ? <ArrowRight className="rotate-180" size={14} /> : <ArrowRight size={14} />}
    </div>
  </button>
);

export const InfoDesk: React.FC<InfoDeskProps> = ({ language }) => {
  const t = translations[language];
  const isRtl = t.dir === 'rtl';
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [publicBodies, setPublicBodies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copiedId, setCopiedId] = useState<any>(null);
  const [selectedBody, setSelectedBody] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Info Desk Documents
        const docsRes = await fetch(`${API_BASE_URL}/api/info-desk/list/`);
        if (docsRes.ok) {
          setDocs(await docsRes.json());
        }
        
        // Fetch Public Bodies
        const bodiesRes = await fetch(`${API_BASE_URL}/api/public-bodies/list/`);
        if (bodiesRes.ok) {
          setPublicBodies(await bodiesRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const getLocalized = (item: any, field: string) => {
    if (language === Language.UR) return item[`${field}_ur`] || item[`${field}_en`];
    if (language === Language.SD) return item[`${field}_sd`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  const getDisplayNameString = (body: any) => {
    const name = getLocalized(body, 'name');
    if (body.name_en === body.department_name) {
      const suffix = language === Language.UR ? ' (سیکریٹریٹ)' : language === Language.SD ? ' (سيڪريٽريٽ)' : ' (Secretariat)';
      return `${name}${suffix}`;
    }
    return name;
  };

  const getMatchContext = (body: any) => {
    if (!searchQuery) return null;
    const normalize = (str: any) => str ? String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\u064B-\u065F\u0670]/g, "") : "";
    const q = normalize(searchQuery);
    
    if (normalize(getLocalized(body, 'name')).includes(q)) return null;
    if (normalize(getLocalized(body, 'address')).includes(q)) return null;

    if (normalize(getLocalized(body, 'pio_name')).includes(q)) return `PIO: ${getLocalized(body, 'pio_name')}`;
    if (normalize(getLocalized(body, 'hod_name')).includes(q)) return `HOD: ${getLocalized(body, 'hod_name')}`;
    if (normalize(body.pio_contact).includes(q)) return `Contact: ${body.pio_contact}`;
    if (normalize(body.pio_email).includes(q)) return `PIO Email: ${body.pio_email}`;
    if (normalize(body.hod_email).includes(q)) return `HOD Email: ${body.hod_email}`;
    if (normalize(body.email).includes(q)) return `Email: ${body.email}`;
    if (normalize(body.phone).includes(q)) return `Phone: ${body.phone}`;
    if (normalize(body.website).includes(q)) return `Web: ${body.website}`;
    if (normalize(body.name_en).includes(q)) return `Name (EN): ${body.name_en}`;
    return null;
  };

  const handleCopyInfo = (body: any) => {
    const info = [
      `Department: ${getDisplayNameString(body)}`,
      getLocalized(body, 'address') ? `Address: ${getLocalized(body, 'address')}` : '',
      getLocalized(body, 'pio_name') ? `PIO: ${getLocalized(body, 'pio_name')}` : '',
      body.pio_contact ? `PIO Contact: ${body.pio_contact}` : '',
      body.pio_email ? `PIO Email: ${body.pio_email}` : '',
      getLocalized(body, 'hod_name') ? `HOD: ${getLocalized(body, 'hod_name')}` : '',
      body.hod_contact ? `HOD Contact: ${body.hod_contact}` : '',
      body.hod_email ? `HOD Email: ${body.hod_email}` : '',
      body.email ? `Email: ${body.email}` : '',
      body.phone ? `Phone: ${body.phone}` : '',
      body.website ? `Website: ${body.website}` : ''
    ].filter(Boolean).join('\n');
    
    navigator.clipboard.writeText(info);
    setCopiedId(body.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReport = (body: any) => {
    const subject = encodeURIComponent(`Incorrect Info Report: ${getDisplayNameString(body)}`);
    const bodyText = encodeURIComponent(`I found incorrect information for the following department:\n\nName: ${getDisplayNameString(body)}\nID: ${body.id}\n\nDetails of incorrect info:\n`);
    window.location.href = `mailto:feedback@sic.gos.pk?subject=${subject}&body=${bodyText}`;
  };

  const filteredDocs = activeModal ? docs.filter(d => d.category === activeModal) : [];
  const filteredBodies = publicBodies.filter(b => {
    // Normalize helper to handle diacritics and case for English, Urdu, and Sindhi
    const normalize = (str: any) => 
      str ? String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\u064B-\u065F\u0670]/g, "") : "";

    const query = normalize(searchQuery);
    const check = (val: any) => normalize(val).includes(query);
    
    return (
      check(b.name_en) || check(b.name_ur) || check(b.name_sd) ||
      check(b.address_en) || check(b.address_ur) || check(b.address_sd) ||
      check(b.pio_name_en) || check(b.pio_name_ur) || check(b.pio_name_sd) ||
      check(b.hod_name_en) || check(b.hod_name_ur) || check(b.hod_name_sd) ||
      check(b.pio_contact) || check(b.pio_email) || check(b.hod_email) || 
      check(b.website) || check(b.email) || check(b.phone)
    );
  });

  const sections = [
    {
      id: 'advertisements',
      title: t.advertisementTitle,
      description: t.advertisementDesc,
      icon: Megaphone
    },
    {
      id: 'tenders',
      title: t.tenderTitle,
      description: t.tenderDesc,
      icon: FileText
    },
    {
      id: 'public-bodies',
      title: t.publicBodiesTitle,
      description: t.publicBodiesDesc,
      icon: Building2
    },
    {
      id: 'pio-guidelines',
      title: t.pioGuidelinesTitle,
      description: t.pioGuidelinesDesc,
      icon: BookOpenCheck
    },
    {
      id: 'proactive-disclosures',
      title: t.disclosuresTitle,
      description: t.disclosuresDesc,
      icon: Eye
    },
    {
      id: 'publications',
      title: t.publicationsTitle,
      description: t.publicationsDesc,
      icon: Newspaper
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section>
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`${isRtl ? 'text-right' : 'text-start'}`}>
            <div className={`flex items-center gap-4 mb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="h-10 w-2 bg-blue-700 rounded-full"></div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase">
                {t.infoDeskTitle}
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-medium text-lg">
              {t.infoDeskSubtitle}
            </p>
          </div>
          <div className="bg-amber-400 text-slate-950 px-6 py-4 rounded-3xl flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shrink-0">
            <ExternalLink size={18} />
            {t.publicAccess}
          </div>
        </div>

        {/* Quick Help Box / PIO Search */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 relative flex flex-col justify-center mb-12">
          <div className="absolute inset-0 overflow-hidden rounded-[3rem] pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className={`text-2xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight ${isRtl ? 'text-right' : 'text-left'}`}>
              {t.pioSearchTitle}
            </h3>
            <p className={`text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t.pioSearchDesc}
            </p>
            <div className="relative">
              <div className={`flex bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <input 
                  type="text" 
                  placeholder={t.searchDeptPlaceholder} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setActiveModal('public-bodies');
                      setShowSuggestions(false);
                    }
                  }}
                  className={`bg-transparent border-none focus:ring-0 text-xs px-4 py-2 w-full text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-bold outline-none ${isRtl ? 'text-right' : 'text-left'}`}
                />
                <button 
                  onClick={() => setActiveModal('public-bodies')}
                  className="bg-amber-400 text-slate-900 p-2 rounded-xl hover:bg-amber-300 transition-colors shrink-0"
                >
                  <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && searchQuery && filteredBodies.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[300px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                  {filteredBodies.map((body) => {
                    const matchContext = getMatchContext(body);
                    return (
                    <button
                      key={body.id}
                      onClick={() => {
                        setSelectedBody(body);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      className={`w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 flex items-center justify-between group ${isRtl ? 'text-right flex-row-reverse' : 'text-left'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">
                          <HighlightText text={getDisplayNameString(body)} highlight={searchQuery} />
                        </h4>
                        {getLocalized(body, 'address') && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            <HighlightText text={getLocalized(body, 'address')} highlight={searchQuery} />
                          </p>
                        )}
                        {matchContext && (
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 line-clamp-1 mt-0.5 font-bold">
                            <HighlightText text={matchContext} highlight={searchQuery} />
                          </p>
                        )}
                      </div>
                      <ArrowRight size={14} className={`text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 ${isRtl ? 'rotate-180 mr-3' : 'ml-3'}`} />
                    </button>
                  )})}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedBody ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <button 
                onClick={() => setSelectedBody(null)}
                className={`mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft size={20} className={isRtl ? 'rotate-180' : ''} />
                {isRtl ? 'واپس' : 'Back to Search'}
              </button>

              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{getDisplayNameString(selectedBody)}</h2>
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">
                    {selectedBody.complaint_count || 0} Complaints
                  </span>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button 
                    onClick={() => handleCopyInfo(selectedBody)}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-colors ${copiedId === selectedBody.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    {copiedId === selectedBody.id ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Info</>}
                  </button>
                  <button 
                    onClick={() => handleReport(selectedBody)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Flag size={16} /> Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Building2 size={16} /> Department Details</h4>
                    <div className="space-y-5">
                      {getLocalized(selectedBody, 'address') && (
                        <div className="flex gap-4 text-base text-slate-700 dark:text-slate-300 font-medium">
                          <MapPin size={20} className="shrink-0 text-slate-400 mt-0.5" />
                          <span>{getLocalized(selectedBody, 'address')}</span>
                        </div>
                      )}
                      {selectedBody.website && (
                        <a href={selectedBody.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-base text-blue-600 dark:text-blue-400 font-bold hover:underline">
                          <LinkIcon size={20} className="shrink-0" /> {selectedBody.website}
                        </a>
                      )}
                      {selectedBody.email && (
                        <div className="flex items-center gap-4 text-base text-slate-700 dark:text-slate-300 font-medium">
                          <Mail size={20} className="shrink-0 text-slate-400" /> {selectedBody.email}
                        </div>
                      )}
                      {selectedBody.phone && (
                        <div className="flex items-center gap-4 text-base text-slate-700 dark:text-slate-300 font-medium">
                          <Phone size={20} className="shrink-0 text-slate-400" /> {selectedBody.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={16} /> Public Information Officer (PIO)</h4>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{getLocalized(selectedBody, 'pio_name') || 'N/A'}</p>
                      {getLocalized(selectedBody, 'pio_designation') && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{getLocalized(selectedBody, 'pio_designation')}</p>}
                      {selectedBody.pio_contact && <p className="text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-2 mt-2"><Phone size={14} /> {selectedBody.pio_contact}</p>}
                      {selectedBody.pio_email && <p className="text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-2 mt-1"><Mail size={14} /> {selectedBody.pio_email}</p>}
                      {getLocalized(selectedBody, 'pio_address') && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> {getLocalized(selectedBody, 'pio_address')}</p>}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={16} /> Head of Department (HOD)</h4>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{getLocalized(selectedBody, 'hod_name') || 'N/A'}</p>
                      {getLocalized(selectedBody, 'hod_designation') && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{getLocalized(selectedBody, 'hod_designation')}</p>}
                      {selectedBody.hod_contact && <p className="text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-2 mt-2"><Phone size={14} /> {selectedBody.hod_contact}</p>}
                      {selectedBody.hod_email && <p className="text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-2 mt-1"><Mail size={14} /> {selectedBody.hod_email}</p>}
                      {getLocalized(selectedBody, 'hod_address') && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> {getLocalized(selectedBody, 'hod_address')}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <InfoCard 
              key={section.id}
              title={section.title}
              description={section.description}
              icon={section.icon}
              isRtl={isRtl}
              viewLabel={t.viewSection}
              onClick={() => setActiveModal(section.id)}
            />
          ))}
        </div>
        )}

        {/* Modal */}
        {activeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300 pointer-events-none">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto" onClick={e => e.stopPropagation()} dir={t.dir}>
              <div className="py-2 px-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  {sections.find(s => s.id === activeModal)?.title || t.infoDeskTitle}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                  <X size={24} className="text-slate-500" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto">
                {activeModal === 'public-bodies' ? (
                  <div className="space-y-6">
                    <div className="relative mb-6">
                      <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} size={20} />
                      <input 
                        type="text" 
                        placeholder={t.searchDeptPlaceholder}
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-2xl py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 dark:text-slate-200`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBodies.map((body) => (
                        <div key={body.id} className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all bg-slate-50 dark:bg-slate-800/30">
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <h4 className="font-black text-lg text-slate-800 dark:text-slate-100">{getDisplayNameString(body)}</h4>
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-black px-2 py-1 rounded-lg shrink-0 whitespace-nowrap">
                              {body.complaint_count || 0} Complaints
                            </span>
                          </div>
                          <div className="space-y-4">
                            {/* Department Details */}
                            <div className="space-y-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                            {getLocalized(body, 'address') && (
                              <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <MapPin size={14} className="shrink-0 mt-0.5" />
                                <span>{getLocalized(body, 'address')}</span>
                              </div>
                            )}
                            {(body.website || body.email || body.phone) && (
                                <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                                    {body.website && (
                                        <a href={body.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                                            <LinkIcon size={14} /> Website
                                        </a>
                                    )}
                                    {body.email && (
                                        <div className="flex items-center gap-1">
                                            <Mail size={14} /> {body.email}
                                        </div>
                                    )}
                                    {body.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone size={14} /> {body.phone}
                                        </div>
                                    )}
                                </div>
                            )}
                            </div>

                            {/* PIO Details */}
                            <div className="space-y-1">
                                <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Public Information Officer (PIO)</h5>
                                <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                                    <User size={14} className="shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                                    <div className="flex flex-col">
                                        <span className="font-bold">{getLocalized(body, 'pio_name') || 'N/A'}</span>
                                        {getLocalized(body, 'pio_designation') && <span className="text-[10px] opacity-80">{getLocalized(body, 'pio_designation')}</span>}
                                    </div>
                                </div>
                                {(body.pio_contact || getLocalized(body, 'pio_address')) && (
                                    <div className="pl-6 space-y-1 mt-1">
                                        {body.pio_contact && <div className="flex items-center gap-2 text-[10px] text-slate-500"><Phone size={10} /> {body.pio_contact}</div>}
                                        {getLocalized(body, 'pio_address') && <div className="flex items-start gap-2 text-[10px] text-slate-500"><MapPin size={10} className="mt-0.5" /> {getLocalized(body, 'pio_address')}</div>}
                                    </div>
                                )}
                            </div>

                            {/* HOD Details */}
                            <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                                <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Head of Department (HOD)</h5>
                                <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                                    <User size={14} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                                    <div className="flex flex-col">
                                        <span className="font-bold">{getLocalized(body, 'hod_name') || 'N/A'}</span>
                                        {getLocalized(body, 'hod_designation') && <span className="text-[10px] opacity-80">{getLocalized(body, 'hod_designation')}</span>}
                                    </div>
                                </div>
                                {(body.hod_contact || getLocalized(body, 'hod_address')) && (
                                    <div className="pl-6 space-y-1 mt-1">
                                        {body.hod_contact && <div className="flex items-center gap-2 text-[10px] text-slate-500"><Phone size={10} /> {body.hod_contact}</div>}
                                        {getLocalized(body, 'hod_address') && <div className="flex items-start gap-2 text-[10px] text-slate-500"><MapPin size={10} className="mt-0.5" /> {getLocalized(body, 'hod_address')}</div>}
                                    </div>
                                )}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                            <button 
                              onClick={() => handleCopyInfo(body)}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-colors ${copiedId === body.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                            >
                              {copiedId === body.id ? (
                                <><Check size={14} /> Copied!</>
                              ) : (
                                <><Copy size={14} /> Copy Info</>
                              )}
                            </button>
                            <button 
                              onClick={() => handleReport(body)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            >
                              <Flag size={14} /> Report Issue
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredBodies.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-400 font-medium">No departments found matching your search.</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                              <FileText size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{getLocalized(doc, 'title')}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{doc.publication_date}</p>
                            </div>
                          </div>
                          {doc.file ? (
                            <a href={doc.file} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-colors">
                              Download
                            </a>
                          ) : doc.link ? (
                            <a href={doc.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                              Visit <ExternalLink size={14} />
                            </a>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 text-slate-400 font-medium">No documents available in this section yet.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Official Links Footer for Info Desk */}
      <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`${isRtl ? 'text-right' : 'text-start'}`}>
            <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">{t.legalCompliance}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{t.ensuringCompliance}</p>
          </div>
          <div className={`flex flex-wrap gap-4 justify-center ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all">
              {t.sopsDepts}
            </button>
            <button className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all">
              {t.stdRequestForm}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
