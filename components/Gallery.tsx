import React, { useState, useEffect } from 'react';
import { ExternalLink, Image as ImageIcon, X, ChevronLeft, ChevronRight, Search, Calendar, ArrowLeft } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface EventImage {
  id: number;
  image: string;
}

interface Event {
  id: number;
  title_en: string;
  title_ur?: string;
  title_sd?: string;
  slug: string;
  content_en: string;
  content_ur?: string;
  content_sd?: string;
  social_media_link?: string;
  event_date: string;
  images: EventImage[];
}

interface GalleryProps {
  language: Language;
  onBack?: () => void;
  eventPageId?: number | null;
  onBackFromEventPage?: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ language, onBack, eventPageId = null, onBackFromEventPage }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const t = translations[language];
  const isRtl = t.dir === 'rtl';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery/list/`);
        if (response.ok) {
          setEvents(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setCurrentImageIndex(0);
    }
  }, [selectedEvent]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getLocalized = (item: any, field: string) => {
    if (language === Language.UR) return item[`${field}_ur`] || item[`${field}_en`];
    if (language === Language.SD) return item[`${field}_sd`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedEvent && selectedEvent.images && selectedEvent.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedEvent && selectedEvent.images && selectedEvent.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
    }
  };

  const filteredEvents = events.filter(event => {
    const title = getLocalized(event, 'title').toLowerCase();
    const content = getLocalized(event, 'content').toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || content.includes(query);
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const eventPageEvent = eventPageId ? events.find((event) => event.id === eventPageId) || null : null;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500" dir={t.dir}>
      <div className={`${eventPageEvent ? 'hidden sm:flex' : 'flex'} flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {onBack && (
            <button 
              onClick={onBack}
              className={`p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${eventPageEvent ? 'hidden sm:inline-flex' : 'inline-flex'}`}
            >
              <ArrowLeft size={20} className={`text-slate-600 dark:text-slate-300 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          )}
          <div className={eventPageEvent ? 'hidden sm:block' : 'block'}>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">{t.galleryTitle}</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest opacity-80">{t.latestUpdates}</p>
          </div>
        </div>
        
        <div className={`relative w-full md:w-96 ${eventPageEvent ? 'hidden sm:block' : 'block'}`}>
          <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} size={20} />
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:ring-2 focus:ring-purple-500/20 font-bold text-slate-700 dark:text-slate-200 shadow-sm`}
          />
        </div>
      </div>

      {eventPageEvent ? (
        <section className="bg-white dark:bg-slate-900 -mx-2 sm:mx-0 -mt-8 sm:mt-0 rounded-none sm:rounded-[2rem] overflow-hidden border-b sm:border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-full h-[38vh] md:h-[50vh] bg-slate-950 relative group select-none">
            {eventPageEvent.images && eventPageEvent.images.length > 0 ? (
              <>
                <img
                  src={eventPageEvent.images[currentImageIndex].image}
                  alt={getLocalized(eventPageEvent, 'title')}
                  className="w-full h-full object-contain"
                />
                {eventPageEvent.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-all">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-all">
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
                
                {/* Mobile Back Button Overlay */}
                {onBackFromEventPage && (
                  <button 
                    onClick={onBackFromEventPage} 
                    className="sm:hidden absolute top-4 left-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all z-10"
                  >
                    <ArrowLeft size={20} className={isRtl ? 'rotate-180' : ''} />
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 relative">
                {onBackFromEventPage && (
                  <button 
                    onClick={onBackFromEventPage} 
                    className="sm:hidden absolute top-4 left-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all z-10"
                  >
                    <ArrowLeft size={20} className={isRtl ? 'rotate-180' : ''} />
                  </button>
                )}
                <ImageIcon size={64} />
              </div>
            )}
          </div>
          <div className="p-6 md:p-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-widest">
                <Calendar size={12} />
                {new Date(eventPageEvent.event_date).toLocaleDateString()}
              </span>
              {onBackFromEventPage && (
                <button onClick={onBackFromEventPage} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700">
                  <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} />
                  Back
                </button>
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-5">
              {getLocalized(eventPageEvent, 'title')}
            </h3>
            <div className="prose dark:prose-invert max-w-none mb-8 text-slate-600 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: getLocalized(eventPageEvent, 'content') }} />
            {eventPageEvent.social_media_link && (
              <a href={eventPageEvent.social_media_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-500 hover:text-white transition-all">
                View on Social Media <ExternalLink size={16} />
              </a>
            )}
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedEvents.length > 0 ? paginatedEvents.map((event) => (
            <div key={event.id} onClick={() => setSelectedEvent(event)} className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900 transition-all hover:shadow-xl cursor-pointer flex flex-col h-full">
              <div className="aspect-video bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                {event.images && event.images.length > 0 ? (
                  <img 
                    src={event.images[0].image} 
                    alt={getLocalized(event, 'title')} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 shadow-sm">
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {getLocalized(event, 'title')}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed flex-1">
                  {getLocalized(event, 'content')}
                </p>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 text-slate-400 font-medium">No events found.</div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!eventPageEvent && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
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

      {/* Event Detail Modal */}
      {selectedEvent && !eventPageEvent && (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300 pointer-events-none"
            onClick={() => setSelectedEvent(null)}
        >
            <div 
                className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative flex flex-col animate-in zoom-in-95 duration-300 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-6 right-6 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all z-20 shadow-sm"
                >
                    <X size={24} />
                </button>

                <div className="overflow-y-auto flex-1 scrollbar-hide">
                    <div className="w-full h-[40vh] md:h-[50vh] bg-slate-950 relative shrink-0 group select-none">
                        {selectedEvent.images && selectedEvent.images.length > 0 ? (
                        <>
                            <img 
                                src={selectedEvent.images[currentImageIndex].image} 
                                alt={getLocalized(selectedEvent, 'title')} 
                                className="w-full h-full object-contain"
                            />
                            {selectedEvent.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={28} />
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={28} />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-full">
                                        {selectedEvent.images.map((_, idx) => (
                                            <div 
                                              key={idx} 
                                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <ImageIcon size={64} />
                        </div>
                    )}
                    </div>

                    <div className="p-8 md:p-12 bg-white dark:bg-slate-900">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-widest">
                                    <Calendar size={12} />
                                    {new Date(selectedEvent.event_date).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 leading-tight tracking-tight">
                                {getLocalized(selectedEvent, 'title')}
                            </h3>
                        </div>
                        
                        <div 
                            className="prose dark:prose-invert max-w-none mb-10 text-slate-600 dark:text-slate-300 leading-relaxed text-lg"
                            dangerouslySetInnerHTML={{ __html: getLocalized(selectedEvent, 'content') }}
                        />

                        {selectedEvent.social_media_link && (
                            <a 
                                href={selectedEvent.social_media_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                            >
                                View on Social Media <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
