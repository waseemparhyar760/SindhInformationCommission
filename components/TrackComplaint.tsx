import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Scale, AlertCircle, Gavel, CheckCircle2, Clock, XCircle, Calendar, Users, Download, X, Eye, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';
import { API_BASE_URL } from '../config';

interface TrackComplaintProps {
  language: Language;
}

export const TrackComplaint: React.FC<TrackComplaintProps> = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('FIRST_NOTICE');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const isInitialMount = useRef(true);

  const t = translations[language];
  const isRtl = t.dir === 'rtl';

  const statuses = [
    { id: 'FIRST_NOTICE', label: t.statusFirstNotice, icon: AlertCircle },
    { id: 'FINAL_NOTICE', label: t.statusFinalNotice, icon: AlertCircle },
    { id: 'SHOW_CAUSE', label: t.statusShowCause, icon: Scale },
    { id: 'FINAL_SHOW_CAUSE', label: t.statusFinalShowCause, icon: Scale },
    { id: 'TEN_DAYS_ORDER', label: t.statusTenDays, icon: Clock },
    { id: 'PENALTY_ORDER', label: t.statusPenalty, icon: Gavel },
    { id: 'DISPOSED_OFF', label: t.statusDisposed, icon: CheckCircle2 },
  ];

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchComplaints();
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [complaints]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/complaint/submit/?`;
      
      if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}`;
      } else {
        url += `hearings__procedural_status=${activeTab}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchInitiated(true);
    fetchComplaints();
  };

  const handleTabClick = (statusId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setSearchTerm(''); // Clear search when switching tabs to show the list
    setSearchInitiated(true);
    setActiveTab(statusId);
    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const handlePreview = (path: string) => {
    setPreviewUrl(getFileUrl(path));
  };

  const statusFileMap: Record<string, string> = {
    'INFO_PROVIDED': 'info_provided_file',
    'FIRST_NOTICE': 'first_notice_file',
    'FINAL_NOTICE': 'final_notice_file',
    'SHOW_CAUSE': 'show_cause_file',
    'FINAL_SHOW_CAUSE': 'final_show_cause_file',
    'TEN_DAYS_ORDER': 'ten_days_order_file',
    'PENALTY_ORDER': 'penalty_order_file',
    'ADJOURNMENT': 'adjournment_file',
    'RECALL': 'recall_file',
    'FURTHER_PROCEEDINGS': 'further_proceedings_file',
    'DISPOSED_OFF': 'disposed_off_file',
    'NON_MAINTAINABLE': 'non_maintainable_file',
  };

  const totalPages = Math.ceil(complaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = complaints.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Search Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl p-8 md:p-12 mb-12 border border-slate-100 dark:border-slate-800 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {t.trackTitle}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
          {t.trackDesc}
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
          <input 
            type="text" 
            placeholder={t.trackPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full h-16 ${isRtl ? 'pr-6 pl-16' : 'pl-6 pr-16'} bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium shadow-sm group-hover:shadow-md`}
          />
          <button 
            type="submit"
            className={`absolute top-2 bottom-2 ${isRtl ? 'left-2' : 'right-2'} aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg`}
          >
            <Search size={24} />
          </button>
        </form>
      </div>

      {/* Status Tabs */}
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-3 min-w-max px-2">
          {statuses.map((status) => {
            const Icon = status.icon;
            const isActive = activeTab === status.id;
            return (
              <button
                key={status.id}
                onClick={(e) => handleTabClick(status.id, e)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon size={16} />
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 font-medium">Loading records...</p>
          </div>
        ) : searchInitiated && complaints.length > 0 ? (
          <>
          {paginatedComplaints.map((complaint) => {
            const hearings = complaint.hearings || [];
            const now = new Date();
            // Use local date to ensure accurate comparison with hearing_date (YYYY-MM-DD)
            const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
            
            // Sort scheduled hearings ascending (earliest first) to find the next one
            const upcoming = hearings
              .filter((h: any) => h.hearing_date >= todayStr)
              .sort((a: any, b: any) => new Date(a.hearing_date).getTime() - new Date(b.hearing_date).getTime())[0];
            
            // Sort non-scheduled (past) hearings descending (latest first)
            const previous = hearings
              .filter((h: any) => h.hearing_date < todayStr)
              .sort((a: any, b: any) => new Date(b.hearing_date).getTime() - new Date(a.hearing_date).getTime());

            // Find the latest hearing that has a valid status file for the main "View Order" button
            const latestHearingWithOrder = [...hearings]
              .sort((a: any, b: any) => new Date(b.hearing_date).getTime() - new Date(a.hearing_date).getTime())
              .find((h: any) => h.procedural_status && statusFileMap[h.procedural_status] && h[statusFileMap[h.procedural_status]]);
            
            const latestOrderFile = latestHearingWithOrder ? latestHearingWithOrder[statusFileMap[latestHearingWithOrder.procedural_status]] : null;

            return (
              <div 
                key={complaint.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
                          {complaint.complaint_year ? `No. ${complaint.complaint_number}/${complaint.complaint_year}` : 'Pending No.'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                        {complaint.full_name} <span className="text-slate-400 mx-1">V/s</span> {complaint.department}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                        {complaint.subject}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pl-16 md:pl-0">
                    {latestOrderFile && (
                      <button 
                        onClick={() => handlePreview(latestOrderFile)}
                        className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Eye size={16} />
                        {t.previewOrder}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <Clock size={16} className="text-slate-400" />
                      {t.previousHearings}
                    </h4>
                    {previous.length > 0 ? (
                      <div className="space-y-3">
                        {previous.map((h: any) => (
                          <div key={h.id} className={`p-3 rounded-xl border text-sm ${
                            (!h.complainant_is_present || !h.respondent_is_present) 
                              ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' 
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'
                          }`}>
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Calendar size={14} className="text-slate-400" />
                                {h.hearing_date}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 uppercase">{h.hearing_time}</span>
                            </div> 
                            {h.serial_number && <p className="text-xs text-slate-500"><span className="font-bold">{t.serialNo}:</span> {h.serial_number}</p>}
                            {h.bench_members && <p className="text-xs text-slate-500"><span className="font-bold">{t.bench}:</span> {h.bench_members}</p>}
                            
                            {h.procedural_status && (
                              <div className="mt-2 flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{statuses.find(s => s.id === h.procedural_status)?.label || h.procedural_status}</span>
                                {h[statusFileMap[h.procedural_status]] && (
                                  <button
                                    onClick={() => handlePreview(h[statusFileMap[h.procedural_status]])}
                                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-1.5 rounded-md transition-colors"
                                    title={t.previewOrder}
                                  >
                                    <Eye size={14} />
                                  </button>
                                )}
                              </div>
                            )}

                            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                              <p className="text-[10px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1"><Users size={12} /> {t.attendance}</p>
                              {h.complainant_name && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                  <span className="font-bold">{t.complainant}:</span> {h.complainant_name}
                                  {!h.complainant_is_present && (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400 px-1.5 py-0.5 rounded uppercase">{t.absent}</span>
                                  )}
                                </p>
                              )}
                              {h.respondent_name && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                                  <span className="font-bold">{t.respondent}:</span> {h.respondent_name}
                                  {!h.respondent_is_present && (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400 px-1.5 py-0.5 rounded uppercase">{t.absent}</span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">No previous hearings found.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <Calendar size={16} className="text-blue-500" />
                      {t.nextHearingLabel}
                    </h4>
                    {upcoming ? (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-white dark:bg-blue-800 rounded-xl flex flex-col items-center justify-center text-blue-600 dark:text-blue-300 shadow-sm shrink-0">
                            <span className="text-lg font-black leading-none">{new Date(upcoming.hearing_date).getDate()}</span>
                            <span className="text-[9px] font-bold uppercase">{new Date(upcoming.hearing_date).toLocaleString('default', { month: 'short' })}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                              {new Date(upcoming.hearing_date).toLocaleString('default', { weekday: 'long' })} at {upcoming.hearing_time}
                            </p>
                            <p className="font-black text-slate-900 dark:text-white text-lg leading-none">{t.serialNo}: {upcoming.serial_number || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-blue-100 dark:border-blue-800/50">
                          {upcoming.complainant_name && (
                            <div className="text-xs text-slate-600 dark:text-slate-300">
                              <span className="font-bold opacity-70">{t.complainant}:</span> {upcoming.complainant_name}
                            </div>
                          )}
                          {upcoming.respondent_name && (
                            <div className="text-xs text-slate-600 dark:text-slate-300">
                              <span className="font-bold opacity-70">{t.respondent}:</span> {upcoming.respondent_name}
                            </div>
                          )}
                          {upcoming.bench_members && (
                            <div className="text-xs text-slate-600 dark:text-slate-300">
                              <span className="font-bold opacity-70">{t.bench}:</span> {upcoming.bench_members}
                            </div>
                          )}
                          {upcoming.procedural_status && (
                            <div className="text-xs text-slate-600 dark:text-slate-300">
                              <span className="font-bold opacity-70">{t.orderPassed}:</span> 
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-black text-blue-600 dark:text-blue-400">{statuses.find(s => s.id === upcoming.procedural_status)?.label || upcoming.procedural_status}</span>
                                {upcoming[statusFileMap[upcoming.procedural_status]] && (
                                  <button
                                    onClick={() => handlePreview(upcoming[statusFileMap[upcoming.procedural_status]])}
                                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-[10px] font-bold uppercase tracking-wide"
                                  >
                                    <Eye size={12} /> {t.previewOrder}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/30">
                        <p className="text-sm text-slate-400 italic">No hearing scheduled.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft size={20} className={isRtl ? 'rotate-180' : ''} />
              </button>
              <span className="text-sm font-black text-slate-600 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight size={20} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>
          )}
          </>
        ) : searchInitiated && complaints.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <XCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">{t.noRecordsFound}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchTerm 
                ? `${t.noRecordsFound} "${searchTerm}"`
                : `${t.noComplaintsFound} "${statuses.find(s => s.id === activeTab)?.label}"`
              }
            </p>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Info size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">{t.trackTitle}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.trackDesc}</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.previewOrder}</h3>
              <button onClick={() => setPreviewUrl(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
              <iframe src={previewUrl} className="w-full h-full" title="Document Preview" />
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
              <a href={previewUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Download size={18} /> {t.downloadOrder}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};