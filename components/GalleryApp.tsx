import React, { useState, useEffect } from 'react';
import { ExternalLink, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface GalleryAppProps {
  language: Language;
  onViewAll?: () => void;
  onOpenEventPage?: (eventId: number) => void;
}

export const GalleryApp: React.FC<GalleryAppProps> = ({ language, onViewAll, onOpenEventPage }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const t = translations[language];

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

  useEffect(() => {
    if (events.length <= 1) return;

    const sliderTimer = window.setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => window.clearInterval(sliderTimer);
  }, [events.length]);

  useEffect(() => {
    if (currentEventIndex >= events.length) {
      setCurrentEventIndex(0);
    }
  }, [events.length, currentEventIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateLayoutMode = () => setIsMobileLayout(mediaQuery.matches);

    updateLayoutMode();
    mediaQuery.addEventListener('change', updateLayoutMode);

    return () => mediaQuery.removeEventListener('change', updateLayoutMode);
  }, []);

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

  const nextEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (events.length > 1) {
      setCurrentEventIndex((prev) => (prev + 1) % events.length);
    }
  };

  const prevEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (events.length > 1) {
      setCurrentEventIndex((prev) => (prev - 1 + events.length) % events.length);
    }
  };

  const getLocalized = (item: any, field: string) => {
    if (language === Language.UR) return item[`${field}_ur`] || item[`${field}_en`];
    if (language === Language.SD) return item[`${field}_sd`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  const toPlainText = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const handleEventClick = (event: Event) => {
    if (isMobileLayout && onOpenEventPage) {
      onOpenEventPage(event.id);
      return;
    }
    setSelectedEvent(event);
  };

  if (events.length === 0) return null;

  const activeEvent = events[currentEventIndex];
  const activeEventImage = activeEvent?.images && activeEvent.images.length > 0 ? activeEvent.images[0].image : null;
  const activeEventDescription = toPlainText(getLocalized(activeEvent, 'content'));

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm -mx-2 px-0 py-6 rounded-none border-x-0 sm:mx-0 sm:rounded-[2rem] sm:p-8 sm:border">
      <div className="relative group">
        <button
          onClick={prevEvent}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous event"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextEvent}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next event"
        >
          <ChevronRight size={20} />
        </button>

        <div
          onClick={() => handleEventClick(activeEvent)}
          className="relative h-[300px] md:h-[420px] lg:h-[500px] rounded-none sm:rounded-[2rem] overflow-hidden cursor-pointer bg-slate-950"
        >
          {activeEventImage ? (
            <img
              src={activeEventImage}
              alt={getLocalized(activeEvent, 'title')}
              className="w-full h-full object-cover sm:object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
              <ImageIcon size={64} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 md:p-8 max-w-3xl">
            <span className="inline-block mb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 shadow-sm">
              {new Date(activeEvent.event_date).toLocaleDateString()}
            </span>
            <h4 className="text-xl md:text-3xl font-black text-white leading-tight mb-2 line-clamp-2">
              {getLocalized(activeEvent, 'title')}
            </h4>
            <p className="text-sm md:text-base text-white/85 line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">
              {activeEventDescription}
            </p>
            {activeEvent.social_media_link && (
              <a
                href={activeEvent.social_media_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-purple-200"
              >
                View on Social Media <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {events.length > 1 && (
          <div className="flex justify-center gap-2 mt-5 px-2 sm:px-0">
            {events.map((event, idx) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setCurrentEventIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentEventIndex
                    ? 'w-8 bg-purple-600 dark:bg-purple-400'
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
                aria-label={`Go to event ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <button 
        onClick={onViewAll}
        className="w-full mt-10 py-4 px-2 sm:px-0 text-purple-700 dark:text-purple-400 font-black text-xs uppercase tracking-[0.3em] bg-purple-50 dark:bg-purple-900/20 rounded-2xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all active:scale-95 border border-purple-100/50 dark:border-purple-800/50"
      >
        {t.viewAllEvents}
      </button>

      {/* Event Detail Modal */}
      {selectedEvent && !isMobileLayout && (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300 pointer-events-none"
            onClick={() => setSelectedEvent(null)}
        >
            <div 
                className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative flex flex-col animate-in zoom-in-95 duration-300 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all z-10 shadow-sm"
                >
                    <X size={20} />
                </button>

                <div className="overflow-y-auto flex-1 scrollbar-hide">
                    <div className="w-full h-64 md:h-96 bg-slate-950 relative shrink-0 group">
                        {selectedEvent.images && selectedEvent.images.length > 0 ? (
                        <>
                            <img 
                                src={selectedEvent.images[currentImageIndex].image} 
                                alt={getLocalized(selectedEvent, 'title')} 
                                className="w-full h-full object-contain transition-all duration-300"
                            />
                            {selectedEvent.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {selectedEvent.images.map((_, idx) => (
                                            <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={64} />
                        </div>
                    )}
                    </div>

                    <div className="p-4 md:p-8">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-widest mb-3">
                            {new Date(selectedEvent.event_date).toLocaleDateString()}
                        </span>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                            {getLocalized(selectedEvent, 'title')}
                        </h3>
                    </div>
                    
                    <div 
                        className="prose dark:prose-invert max-w-none mb-8 text-slate-600 dark:text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: getLocalized(selectedEvent, 'content') }}
                    />

                    {selectedEvent.social_media_link && (
                        <a 
                            href={selectedEvent.social_media_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-500 hover:text-white transition-all"
                        >
                            View on Social Media <ExternalLink size={16} />
                        </a>
                    )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};