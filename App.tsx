
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ComplaintForm } from './components/ComplaintForm.tsx';
import { Resources } from './components/Resources.tsx';
import { Staff } from './components/Staff.tsx';
import { Statistics } from './components/Statistics.tsx';
import { InfoDesk } from './components/InfoDesk.tsx';
import { HearingsList } from './components/HearingsList.tsx';
import { Careers } from './components/Careers.tsx';
import { TrackComplaint } from './components/TrackComplaint.tsx';
import { Gallery } from './components/Gallery.tsx';
import { AnnualReports } from './components/AnnualReports.tsx';
import { Budget } from './components/Budget.tsx';
import { About } from './components/About.tsx';
import { Notifications } from './components/Notifications.tsx';
import { AppView, Language } from './types.ts';
import { translations } from './i18n.ts';

const VIEW_PATHS: Record<AppView, string> = {
  [AppView.HOME]: '/',
  [AppView.FILE_COMPLAINT]: '/file-complaint',
  [AppView.RESOURCES]: '/resources',
  [AppView.STAFF]: '/staff',
  [AppView.STATISTICS]: '/statistics',
  [AppView.INFO_DESK]: '/info-desk',
  [AppView.HEARINGS_LIST]: '/hearings-list',
  [AppView.CAREERS]: '/careers',
  [AppView.TRACK_COMPLAINT]: '/track-complaint',
  [AppView.GALLERY]: '/gallery',
  [AppView.ANNUAL_REPORTS]: '/annual-reports',
  [AppView.BUDGET]: '/budget',
  [AppView.ABOUT]: '/about',
  [AppView.NOTIFICATIONS]: '/notifications',
};

const PATH_TO_VIEW = Object.entries(VIEW_PATHS).reduce((acc, [view, path]) => {
  acc[path] = view as AppView;
  return acc;
}, {} as Record<string, AppView>);

const GALLERY_EVENT_PATH_REGEX = /^\/gallery\/event\/(\d+)$/;

const parsePathState = (path: string): { view: AppView; galleryEventId: number | null } => {
  const galleryMatch = path.match(GALLERY_EVENT_PATH_REGEX);
  if (galleryMatch) {
    return { view: AppView.GALLERY, galleryEventId: Number(galleryMatch[1]) };
  }
  return { view: PATH_TO_VIEW[path] || AppView.HOME, galleryEventId: null };
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(() => parsePathState(window.location.pathname).view);
  const [galleryEventId, setGalleryEventId] = useState<number | null>(() => parsePathState(window.location.pathname).galleryEventId);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePathState(window.location.pathname);
      setActiveView(parsed.view);
      setGalleryEventId(parsed.galleryEventId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToView = (view: AppView) => {
    const nextPath = VIEW_PATHS[view] || '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setActiveView(view);
    setGalleryEventId(null);
  };

  const navigateToGalleryEvent = (eventId: number) => {
    const nextPath = `/gallery/event/${eventId}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setActiveView(AppView.GALLERY);
    setGalleryEventId(eventId);
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const renderContent = () => {
    switch (activeView) {
      case AppView.HOME:
        return <Dashboard 
          language={language} 
          onViewAllHearings={() => navigateToView(AppView.HEARINGS_LIST)} 
          onViewAllEvents={() => navigateToView(AppView.GALLERY)} 
          onViewAnnualReports={() => navigateToView(AppView.ANNUAL_REPORTS)}
          onOpenEventPage={navigateToGalleryEvent}
        />;
      case AppView.HEARINGS_LIST:
        return <HearingsList language={language} onBack={() => navigateToView(AppView.HOME)} />;
      case AppView.FILE_COMPLAINT:
        return <ComplaintForm language={language} />;
      case AppView.INFO_DESK:
        return <InfoDesk language={language} />;
      case AppView.STATISTICS:
        return <Statistics language={language} />;
      case AppView.RESOURCES:
        return <Resources language={language} />;
      case AppView.STAFF:
        return <Staff language={language} />;
      case AppView.CAREERS:
        return <Careers language={language} />;
      case AppView.TRACK_COMPLAINT:
        return <TrackComplaint language={language} />;
      case AppView.GALLERY:
        return <Gallery language={language} onBack={() => navigateToView(AppView.HOME)} eventPageId={galleryEventId} onBackFromEventPage={() => navigateToView(AppView.GALLERY)} />;
      case AppView.ANNUAL_REPORTS:
        return <AnnualReports language={language} />;
      case AppView.BUDGET:
        return <Budget language={language} />;
      case AppView.ABOUT:
        return <About language={language} />;
      case AppView.NOTIFICATIONS:
        return <Notifications language={language} />;
      default:
        return <Dashboard 
          language={language} 
          onViewAllHearings={() => navigateToView(AppView.HEARINGS_LIST)} 
          onViewAllEvents={() => navigateToView(AppView.GALLERY)} 
          onViewAnnualReports={() => navigateToView(AppView.ANNUAL_REPORTS)}
          onOpenEventPage={navigateToGalleryEvent}
        />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark min-h-screen' : 'min-h-screen'}>
      <Layout 
        activeView={activeView} 
        setActiveView={navigateToView}
        language={language}
        setLanguage={setLanguage}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      >
        {renderContent()}
      </Layout>
    </div>
  );
};

export default App;
