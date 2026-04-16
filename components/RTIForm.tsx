
import React, { useState } from 'react';
import { 
  Send, 
  Upload, 
  CheckCircle2, 
  User, 
  CreditCard, 
  Mail, 
  Phone, 
  Building2, 
  FileSignature, 
  FileText,
  AlertCircle,
  FileDown,
  PlusCircle,
  CheckSquare
} from 'lucide-react';
import { DEPARTMENTS } from '../constants.tsx';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';

interface RTIFormProps {
  language: Language;
}

export const RTIForm: React.FC<RTIFormProps> = ({ language }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [customDept, setCustomDept] = useState('');
  
  const t = translations[language];
  const isRtl = t.dir === 'rtl';

  const isOtherSelected = selectedDept === 'other';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 md:p-20 rounded-[3rem] shadow-2xl text-center max-w-2xl mx-auto border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/40 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
          <CheckCircle2 className="text-blue-600 dark:text-blue-400 w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">{t.successTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg font-medium leading-relaxed">{t.successDesc}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <button 
            onClick={() => setIsSubmitted(false)} 
            className="flex items-center justify-center gap-3 bg-slate-900 dark:bg-blue-800 text-white px-10 py-4.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl active:scale-95"
          >
            <Send size={18} />
            {t.fileAnother}
          </button>
          <button className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-10 py-4.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95">
            <FileDown size={18} />
            {t.downloadPdf}
          </button>
        </div>
      </div>
    );
  }

  const InputWrapper = ({ label, icon: Icon, children }: { label: string, icon: any, children?: React.ReactNode }) => (
    <div className="space-y-3">
      <label className={`flex items-center gap-2.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ${isRtl ? 'flex-row-reverse' : ''}`}>
        <Icon size={14} className="text-blue-600 dark:text-blue-400" />
        {label}
      </label>
      {children}
    </div>
  );

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-semibold outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm";

  const UploadZone = ({ title, description }: { title: string, description: string }) => (
    <div className="group border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all cursor-pointer bg-slate-50 dark:bg-slate-800/20 relative overflow-hidden h-full flex flex-col justify-center">
      <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
        <Upload className="text-slate-400 group-hover:text-blue-600" size={24} />
      </div>
      <h5 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight">{title}</h5>
      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed mb-4 px-2">
        {description}
      </p>
      <span className="inline-block mt-auto text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
        {t.uploadMax}
      </span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
      <div className={`flex flex-col lg:flex-row ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
        {/* Instruction Sidebar */}
        <div className="lg:w-[35%] bg-slate-900 dark:bg-slate-950 p-10 lg:p-14 text-white">
          <div className="sticky top-10 space-y-12">
            <div>
              <h3 className="text-3xl font-black mb-8 leading-tight tracking-tight text-amber-400">{t.beforeFile}</h3>
              <div className="space-y-8">
                <div className={`flex items-start gap-5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="p-3 bg-slate-800/80 rounded-xl shrink-0 border border-slate-700">
                    <FileSignature size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-black text-base mb-1 uppercase tracking-wide">{t.beSpecific}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium opacity-90">{t.beSpecificDesc}</p>
                  </div>
                </div>

                <div className={`flex items-start gap-5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="p-3 bg-slate-800/80 rounded-xl shrink-0 border border-slate-700">
                    <CreditCard size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-black text-base mb-1 uppercase tracking-wide">{t.costCopy}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium opacity-90">{t.costCopyDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800">
              <h3 className="text-2xl font-black mb-6 leading-tight tracking-tight text-blue-400 uppercase">{t.appealProcedureTitle}</h3>
              <div className="space-y-6">
                <div className={`p-5 bg-slate-800/40 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors ${isRtl ? 'text-right' : ''}`}>
                  <h4 className="text-sm font-black mb-2 text-white">{t.internalReviewTitle}</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">{t.internalReviewDesc}</p>
                </div>
                <div className={`p-5 bg-slate-800/40 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors ${isRtl ? 'text-right' : ''}`}>
                  <h4 className="text-sm font-black mb-2 text-white">{t.commissionAppealTitle}</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">{t.commissionAppealDesc}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-blue-900/20 rounded-[2.5rem] border border-blue-800/30 backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-4 text-amber-400">
                 <AlertCircle size={20} />
                 <span className="text-xs font-black uppercase tracking-[0.3em]">Support Desk</span>
               </div>
               <p className="text-[13px] text-slate-300 leading-relaxed font-bold">
                 Confused? Our legal consultants are ready to assist. Call <b>(021) 9920XXXX</b> between office hours.
               </p>
            </div>
          </div>
        </div>
        
        {/* Main Form Area */}
        <div className="lg:w-[65%] p-10 lg:p-20">
          <header className={`mb-16 ${isRtl ? 'text-right' : ''}`}>
            <h2 className="text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tighter">{t.formA}</h2>
            <div className={`h-2 w-28 bg-blue-600 rounded-full ${isRtl ? 'mr-0 ml-auto' : ''}`}></div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              <h4 className={`text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] mb-6 ${isRtl ? 'text-right' : ''}`}>1. Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputWrapper label={t.fullName} icon={User}>
                  <input required type="text" className={inputClasses} placeholder="Full Legal Name" />
                </InputWrapper>
                <InputWrapper label={t.cnic} icon={CreditCard}>
                  <input required type="text" className={inputClasses} placeholder="42101-XXXXXXX-X" />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputWrapper label={t.email} icon={Mail}>
                  <input required type="email" className={inputClasses} placeholder="example@sindh.gov.pk" />
                </InputWrapper>
                <InputWrapper label={t.phone} icon={Phone}>
                  <input required type="tel" className={inputClasses} placeholder="+92 XXX XXXXXXX" />
                </InputWrapper>
              </div>
            </div>

            <div className="space-y-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className={`text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] mb-6 ${isRtl ? 'text-right' : ''}`}>2. Request Specifics</h4>
              
              <InputWrapper label={t.dept} icon={Building2}>
                <div className="space-y-5">
                  <select 
                    className={inputClasses} 
                    required 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    <option value="">Choose Department...</option>
                    {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    <option value="other" className="font-black text-blue-600 italic">✨ {t.other}</option>
                  </select>

                  {isOtherSelected && (
                    <div className="animate-in slide-in-from-top-3 duration-300">
                      <InputWrapper label={t.customDept} icon={PlusCircle}>
                        <input 
                          required 
                          type="text" 
                          className={inputClasses + " bg-blue-50/20 dark:bg-blue-900/5 border-blue-200 dark:border-blue-800 focus:border-blue-600"} 
                          placeholder="Department Name"
                          value={customDept}
                          onChange={(e) => setCustomDept(e.target.value)}
                        />
                      </InputWrapper>
                    </div>
                  )}
                </div>
              </InputWrapper>

              <InputWrapper label={t.subject} icon={FileSignature}>
                <input required type="text" className={inputClasses} placeholder="Subject of your request" />
              </InputWrapper>

              <InputWrapper label={t.details} icon={FileText}>
                <textarea rows={6} className={inputClasses + " resize-none leading-relaxed"} placeholder="Elaborate your request with specific details..." required />
              </InputWrapper>
            </div>

            {/* Document Uploads Section */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className={`text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] mb-8 ${isRtl ? 'text-right' : ''}`}>3. {t.attachments}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputWrapper label={t.uploadPIO} icon={CheckSquare}>
                  <UploadZone 
                    title={t.uploadPIO} 
                    description={t.uploadPIO_desc} 
                  />
                </InputWrapper>
                <InputWrapper label={t.uploadHOD} icon={CheckSquare}>
                  <UploadZone 
                    title={t.uploadHOD} 
                    description={t.uploadHOD_desc} 
                  />
                </InputWrapper>
              </div>
            </div>

            <div className={`flex items-start gap-5 bg-slate-50 dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
               <input 
                 type="checkbox" 
                 required 
                 className="mt-1.5 h-6 w-6 rounded-lg text-blue-600 focus:ring-blue-500/20 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 cursor-pointer" 
               />
               <p className={`text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed ${isRtl ? 'text-right' : ''}`}>
                 <b>Legal Declaration:</b> {t.declaration}
               </p>
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 dark:bg-blue-800 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 hover:bg-blue-700 transition-all shadow-2xl hover:shadow-blue-500/20 active:scale-95 mt-10"
            >
              <Send size={24} className={isRtl ? 'order-2' : ''} />
              <span className="text-xl uppercase tracking-[0.4em]">{t.submit}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
