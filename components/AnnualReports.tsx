import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Eye, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';
import { API_BASE_URL } from '../config';

interface AnnualReport {
  id: number;
  title: string;
  pdf_file: string;
  created_at: string;
  updated_at: string;
}

interface AnnualReportsProps {
  language: Language;
}

export const AnnualReports: React.FC<AnnualReportsProps> = ({ language }) => {
  const [reports, setReports] = useState<AnnualReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const t = translations[language];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/annual-reports/list/`);
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error('Failed to fetch annual reports', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000${path}`;
  };

  const handlePreview = (path: string) => {
    setPreviewUrl(getFileUrl(path));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {t.reports}
        </h2>
        <div className="h-1.5 w-20 bg-blue-600 rounded-full mx-auto"></div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">{t.loadingReports}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(report.created_at).getFullYear()}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                {report.title}
              </h3>
              
              <div className="pt-6 mt-auto">
                <button 
                  onClick={() => handlePreview(report.pdf_file)}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 dark:bg-blue-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
                >
                  <Eye size={16} />
                  {t.previewOrder || 'Preview Report'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && reports.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">{t.noReports}</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent pointer-events-none">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.reports}</h3>
              <button onClick={() => setPreviewUrl(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
              <iframe src={previewUrl} className="w-full h-full" title="Document Preview" />
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
              <a href={previewUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Download size={18} /> {t.downloadPdfLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
