
import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  CheckSquare,
  BadgeInfo,
  UserCheck,
  MapPin,
  Sparkles,
  FileCheck,
  Calendar,
  X,
  HelpCircle,
  Save,
  Printer,
  Scale,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../i18n.ts';
import { API_BASE_URL } from '../config';

interface ComplaintFormProps {
  language: Language;
}

const BaseInputWrapper = ({ 
  label, 
  icon: Icon, 
  children, 
  labelTextSize, 
  labelTracking, 
  textAlignClass,
  tooltip
}: { label: string, icon: any, children?: React.ReactNode, labelTextSize: string, labelTracking: string, textAlignClass: string, tooltip?: string }) => (
  <div className="space-y-2.5 w-full">
    <label className={`flex items-center gap-2.5 ${labelTextSize} font-black text-slate-400 dark:text-slate-500 uppercase ${labelTracking} ${textAlignClass}`}>
      <Icon size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
      <span className="truncate flex-1">{label}</span>
      {tooltip && (
        <div className="group relative shrink-0">
          <HelpCircle size={14} className="text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-800 text-white text-[10px] normal-case font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg pointer-events-none text-center leading-tight">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      )}
    </label>
    <div className="w-full">{children}</div>
  </div>
);

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ language }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicBodies, setPublicBodies] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [currentProcedureStep, setCurrentProcedureStep] = useState(0);
  
  // Personal Info State
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [cnicFront, setCnicFront] = useState<File | null>(null);
  const [cnicBack, setCnicBack] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [sameAsPostal, setSameAsPostal] = useState(false);

  const [selectedPublicBody, setSelectedPublicBody] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [customDept, setCustomDept] = useState('');
  const [publicBodyName, setPublicBodyName] = useState('');
  const [publicBodyContact, setPublicBodyContact] = useState('');
  
  // Official Details State
  const [deptAddress, setDeptAddress] = useState('');
  const [pioName, setPioName] = useState('');
  const [pioDesignation, setPioDesignation] = useState('');
  const [hodName, setHodName] = useState('');
  const [hodDesignation, setHodDesignation] = useState('');
  const [departmentContact, setDepartmentContact] = useState('');
  const [hodAddress, setHodAddress] = useState('');
  
  // Date Logic State
  const [initialRequestDate, setInitialRequestDate] = useState('');
  const [internalReviewDate, setInternalReviewDate] = useState('');
  const [requestMode, setRequestMode] = useState('COURIER');
  const [reviewMode, setReviewMode] = useState('COURIER');
  const [dateError, setDateError] = useState('');

  // Complaint Grounds State
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');

  // File Upload State
  const [applicationFile, setApplicationFile] = useState<File | null>(null);
  const [applicationAckFile, setApplicationAckFile] = useState<File | null>(null);
  const [internalReviewFile, setInternalReviewFile] = useState<File | null>(null);
  const [internalReviewAckFile, setInternalReviewAckFile] = useState<File | null>(null);

  const cnicFrontRef = useRef<HTMLInputElement>(null);
  const cnicBackRef = useRef<HTMLInputElement>(null);
  const applicationFileRef = useRef<HTMLInputElement>(null);
  const applicationAckFileRef = useRef<HTMLInputElement>(null);
  const internalReviewFileRef = useRef<HTMLInputElement>(null);
  const internalReviewAckFileRef = useRef<HTMLInputElement>(null);

  const t = translations[language];
  const isRtl = t.dir === 'rtl';
  const isOtherPublicBody = selectedPublicBody === 'other';
  const isOtherDepartment = selectedDepartment === 'other';

  // Script specific styling
  const isComplexScript = language === Language.SD || language === Language.UR;
  const labelTextSize = isComplexScript ? 'text-[14px]' : 'text-[10px]';
  const labelTracking = isComplexScript ? 'tracking-normal' : 'tracking-[0.2em]';
  const inputFontScale = isComplexScript ? 'text-lg' : 'text-sm';
  const textAlignClass = isRtl ? 'text-right' : 'text-left';

  const steps = [
    { id: 1, label: isRtl ? 'ذاتي معلومات' : 'Personal Info' },
    { id: 2, label: isRtl ? 'کاتي جا تفصيل' : 'Department Details' },
    { id: 3, label: isRtl ? 'شڪايت جا بنياد' : 'Complaint Grounds' },
    { id: 4, label: isRtl ? 'دستاويز' : 'Documents' },
    { id: 5, label: isRtl ? 'جائزو ۽ جمع' : 'Review & Submit' },
  ];

  const procedureSteps = useMemo(() => [
    t.appProcedure1,
    t.appProcedure2,
    t.appProcedure3,
    t.appProcedure4,
    t.appProcedure5,
    t.appProcedure6,
    t.appProcedure7
  ], [t]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProcedureStep((prev) => (prev + 1) % procedureSteps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [procedureSteps.length]);

  useEffect(() => {
    if (sameAsPostal) {
      setPermanentAddress(postalAddress);
    }
  }, [postalAddress, sameAsPostal]);

  const completionProgress = useMemo(() => {
    const requiredFields = [
      fullName, cnic, email, phone, postalAddress, permanentAddress,
      selectedPublicBody, selectedDepartment,
      subject, details, initialRequestDate, internalReviewDate,
      cnicFront, cnicBack,
      applicationFile, internalReviewFile
    ];

    if (selectedDepartment === 'other') requiredFields.push(customDept);
    if (selectedPublicBody === 'other') requiredFields.push(publicBodyName);
    if (requestMode === 'COURIER') requiredFields.push(applicationAckFile);
    if (reviewMode === 'COURIER') requiredFields.push(internalReviewAckFile);

    const filled = requiredFields.filter(f => f).length;
    return Math.round((filled / requiredFields.length) * 100);
  }, [
    fullName, cnic, email, phone, postalAddress, permanentAddress, selectedPublicBody, selectedDepartment, customDept, publicBodyName,
    subject, details, initialRequestDate, internalReviewDate,
    cnicFront, cnicBack, applicationFile, internalReviewFile,
    requestMode, reviewMode, applicationAckFile, internalReviewAckFile
  ]);

  useEffect(() => {
    const fetchPublicBodies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public-bodies/list/`);
        if (response.ok) {
          const data = await response.json();
          setPublicBodies(data);
        }
      } catch (error) {
        console.error("Failed to fetch public bodies", error);
      }
    };
    fetchPublicBodies();
  }, []);

  useEffect(() => {
    const savedDraft = localStorage.getItem('complaint_draft');
    if (savedDraft) {
      const data = JSON.parse(savedDraft);
      if (confirm('A saved draft was found. Do you want to restore it?')) {
        setFullName(data.fullName || '');
        setCnic(data.cnic || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setPostalAddress(data.postalAddress || '');
        setPermanentAddress(data.permanentAddress || '');
        setSelectedPublicBody(data.selectedPublicBody || '');
        setSelectedDepartment(data.selectedDepartment || '');
        setCustomDept(data.customDept || '');
        setPublicBodyName(data.publicBodyName || '');
        setDeptAddress(data.deptAddress || '');
        setPioName(data.pioName || '');
        setPioDesignation(data.pioDesignation || '');
        setHodName(data.hodName || '');
        setHodDesignation(data.hodDesignation || '');
        setHodAddress(data.hodAddress || '');
        setSubject(data.subject || '');
        setDetails(data.details || '');
      }
    }
  }, []);

  const groupedPublicBodies = useMemo(() => {
    const groups: Record<string, any[]> = {};
    publicBodies.forEach(pb => {
      const dept = pb.department_name || 'General';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(pb);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [publicBodies]);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set(publicBodies.map(pb => pb.department_name).filter(Boolean));
    return Array.from(depts).sort();
  }, [publicBodies]);

  const getLoc = (data: any, key: string) => {
    if (!data) return '';
    if (language === Language.UR) return data[`${key}_ur`] || data[`${key}_en`] || '';
    if (language === Language.SD) return data[`${key}_sd`] || data[`${key}_en`] || '';
    return data[`${key}_en`] || '';
  };

  const handlePublicBodyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPublicBody(value);
    
    if (value && value !== 'other') {
      const data = publicBodies.find(b => String(b.id) === value);
      if (data) {
        setPublicBodyName(data.name_en);
        setPioName(getLoc(data, 'pio_name'));
        setPioDesignation(getLoc(data, 'pio_designation'));
        setPublicBodyContact(data.phone || data.pio_contact || '');
        setDeptAddress(getLoc(data, 'address'));

        // Auto-select Department and fill its details
        if (data.department_name) {
          setSelectedDepartment(data.department_name);
          fillDepartmentDetails(data.department_name);
        }
      }
    } else {
      setPublicBodyName('');
      setPioName('');
      setPioDesignation('');
      setPublicBodyContact('');
      setDeptAddress('');
      if (value === 'other') {
        setSelectedDepartment('');
        setHodName('');
        setHodDesignation('');
        setDepartmentContact('');
        setHodAddress('');
      }
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDepartment(value);
    fillDepartmentDetails(value);
  };

  const fillDepartmentDetails = (deptName: string) => {
    if (deptName && deptName !== 'other') {
      // Try to find the Secretariat record for this department to get HOD details
      const secretariat = publicBodies.find(b => b.department_name === deptName && b.name_en === deptName) || 
                          publicBodies.find(b => b.department_name === deptName); // Fallback to any body in dept
      
      if (secretariat) {
        setHodName(getLoc(secretariat, 'hod_name'));
        setHodDesignation(getLoc(secretariat, 'hod_designation'));
        setDepartmentContact(secretariat.department_contact || secretariat.phone || secretariat.hod_contact || '');
        setHodAddress(getLoc(secretariat, 'address')); // Assuming HOD sits at Secretariat address
      }
    } else {
      setHodName('');
      setHodDesignation('');
      setDepartmentContact('');
      setHodAddress('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFile(null);
      return;
    }
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      setFile(file);
    } else {
      alert('Only PDF and Image files are allowed.');
      e.target.value = '';
    }
  };

  const validateDates = () => {
    if (!initialRequestDate || !internalReviewDate) return true;

    const dInitial = new Date(initialRequestDate);
    const dReview = new Date(internalReviewDate);
    const dNow = new Date();
    
    // Normalize to midnight
    dInitial.setHours(0,0,0,0);
    dReview.setHours(0,0,0,0);
    dNow.setHours(0,0,0,0);

    if (dInitial > dNow || dReview > dNow) {
        setDateError(t.dateErrorFuture);
        return false;
    }

    if (dReview <= dInitial) {
        setDateError(t.dateErrorSequence);
        return false;
    }

    // 30 days check
    const diffTime1 = dReview.getTime() - dInitial.getTime();
    const diffDays1 = diffTime1 / (1000 * 3600 * 24);
    if (diffDays1 < 30) {
        setDateError(t.dateError30Days);
        return false;
    }

    // 15 days check
    const diffTime2 = dNow.getTime() - dReview.getTime();
    const diffDays2 = diffTime2 / (1000 * 3600 * 24);
    if (diffDays2 < 15) {
        setDateError(t.dateError15Days);
        return false;
    }

    setDateError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!fullName || !cnic || !email || !phone || !cnicFront || !cnicBack || !postalAddress || !permanentAddress) {
        alert('Please fill all personal information fields and upload CNIC images.');
        return;
      }
    } else if (step === 2) {
      if (!selectedPublicBody) {
        alert('Please select a Public Body.');
        return;
      }
      if (selectedDepartment === 'other' && !customDept.trim()) {
        alert("Please enter the Department Name.");
        return;
      }
    } else if (step === 3) {
      if (!initialRequestDate || !internalReviewDate || !subject || !details) {
        alert('Please fill all complaint grounds details, including dates.');
        return;
      }
      if (!validateDates()) {
        return;
      }
    } else if (step === 4) {
      if (!applicationFile) {
        alert('First Application file is mandatory.');
        return;
      }
      if (requestMode === 'COURIER' && !applicationAckFile) {
        alert('Application Acknowledgement is mandatory for Courier submission.');
        return;
      }
      if (!internalReviewFile) {
        alert('Internal Review Application file is mandatory.');
        return;
      }
      if (reviewMode === 'COURIER' && !internalReviewAckFile) {
        alert('Internal Review Acknowledgement is mandatory for Courier submission.');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmSubmit();
  };

  const handleSaveDraft = () => {
    const draftData = {
      fullName, cnic, email, phone, postalAddress, permanentAddress,
      selectedPublicBody, selectedDepartment, customDept, publicBodyName,
      deptAddress,
      pioName, pioDesignation,
      hodName, hodDesignation, hodAddress,
      subject, details
    };
    localStorage.setItem('complaint_draft', JSON.stringify(draftData));
    alert('Draft saved successfully! (Note: Files are not saved)');
  };

  const handlePrint = () => {
    window.print();
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('cnic', cnic);
    if (cnicFront) formData.append('cnic_front', cnicFront);
    if (cnicBack) formData.append('cnic_back', cnicBack);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('postal_address', postalAddress);
    formData.append('permanent_address', permanentAddress);
    
    // Handle Department Mapping
    if (selectedDepartment === 'other') {
      formData.append('department', customDept);
      formData.append('custom_department', customDept);
    } else {
      formData.append('department', selectedDepartment);
    }

    if (publicBodyName) formData.append('public_body_name', publicBodyName);
    formData.append('public_body_contact', publicBodyContact);
    formData.append('department_address', deptAddress);
    
    formData.append('pio_name', pioName);
    formData.append('pio_designation', pioDesignation);
    // PIO Address removed as per requirement
    
    formData.append('hod_name', hodName);
    formData.append('hod_designation', hodDesignation);
    formData.append('department_contact', departmentContact);
    formData.append('hod_address', hodAddress);
    
    formData.append('initial_request_date', initialRequestDate);
    formData.append('internal_review_date', internalReviewDate);
    formData.append('request_submission_mode', requestMode);
    formData.append('review_submission_mode', reviewMode);

    formData.append('subject', subject);
    formData.append('details', details);
    
    if (applicationFile) formData.append('application_file', applicationFile);
    if (applicationAckFile && requestMode !== 'BY_HAND') formData.append('application_ack_file', applicationAckFile);
    if (internalReviewFile) formData.append('internal_review_file', internalReviewFile);
    if (internalReviewAckFile && reviewMode !== 'BY_HAND') formData.append('internal_review_ack_file', internalReviewAckFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/complaint/submit/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        localStorage.removeItem('complaint_draft');
      } else {
        console.error('Submission failed', await response.json());
        alert('Failed to submit complaint. Please check the form data.');
      }
    } catch (error) {
      console.error('Network error', error);
      alert('Network error. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputWrapper = useMemo(() => {
    return ({ label, icon, children, tooltip }: { label: string, icon: any, children?: React.ReactNode, tooltip?: string }) => (
      <BaseInputWrapper 
        label={label} 
        icon={icon} 
        labelTextSize={labelTextSize} 
        labelTracking={labelTracking} 
        textAlignClass={textAlignClass}
        tooltip={tooltip}
      >
        {children}
      </BaseInputWrapper>
    );
  }, [labelTextSize, labelTracking, textAlignClass]);

  const inputClasses = `w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 ${inputFontScale} ${textAlignClass} font-semibold outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm placeholder:${textAlignClass}`;

  const UploadZone = ({ title, description, file, onUploadClick }: { title: string, description: string, file: File | null, onUploadClick: () => void }) => (
    <div 
      onClick={onUploadClick}
      className={`group border-2 border-dashed ${file ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20'} rounded-[2.5rem] p-8 text-center hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden h-full flex flex-col justify-center min-h-[220px]`}
    >
      <div className={`w-12 h-12 ${file ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-white dark:bg-slate-700'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
        {file ? <FileCheck className="text-emerald-600" size={24} /> : <Upload className="text-slate-400 group-hover:text-blue-600" size={24} />}
      </div>
      <h5 className={`${inputFontScale} font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight px-4`}>
        {file ? file.name : title}
      </h5>
      {!file && (
        <p className={`text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed mb-4 px-2`}>
          {description}
        </p>
      )}
      <span className={`inline-block mt-auto text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${file ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
        {file ? (isRtl ? 'تبديل ڪريو' : 'Click to Change') : t.uploadMax}
      </span>
    </div>
  );

  const CnicUploadButton = ({ label, file, onClick }: { label: string, file: File | null, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border border-dashed cursor-pointer transition-all ${file ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 bg-slate-50 dark:bg-slate-800/50'}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${file ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
        {file ? <CheckCircle2 size={16} /> : <Upload size={16} />}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {label}
        </p>
        <p className={`text-[10px] font-bold truncate ${file ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
          {file ? file.name : t.uploadImage}
        </p>
      </div>
    </div>
  );

  const ReviewItem = ({ label, value, isParagraph = false }: { label: string, value: string | undefined, isParagraph?: boolean }) => (
    <div>
      <span className="text-slate-500 dark:text-slate-400 block text-xs font-black uppercase tracking-widest mb-1">{label}</span>
      {isParagraph ? (
        <p className="font-medium text-slate-700 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">{value}</p>
      ) : (
        <span className="font-bold text-slate-800 dark:text-slate-200 text-base">{value || 'N/A'}</span>
      )}
    </div>
  );

  const FileListItem = ({ fileName, label }: { fileName: string, label: string }) => (
      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
          <FileCheck size={16} className="text-emerald-500 shrink-0" />
          <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{fileName}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          </div>
      </div>
  );

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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 relative">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800 z-10">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${completionProgress}%` }}
        />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Main Form Area */}
        <div className="lg:w-[68%] p-6 lg:p-8">
          <header className={`mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 ${textAlignClass}`}>
            <div>
              <h2 className={`text-lg md:text-2xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tighter leading-tight whitespace-nowrap`}>{t.formA}</h2>
              <div className={`h-1.5 w-20 bg-blue-600 rounded-full ${isRtl ? 'mr-0 ml-auto' : ''}`}></div>
            </div>
            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
               <div className={isRtl ? 'text-left' : 'text-right'}>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Completion</span>
                 <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{completionProgress}%</span>
               </div>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Step Indicator */}
            <div className="mb-12">
              <div className="flex items-center">
                {steps.map((s, index) => (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center text-center w-20">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                        {step > s.id ? <CheckSquare size={20} /> : s.id}
                      </div>
                      <p className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${step >= s.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{s.label}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step > s.id ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* Section 1: Personal Info */}
            {step === 1 && <div className="space-y-6 animate-in fade-in duration-300">
              <h4 className={`text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest`}>1. {isRtl ? 'ذاتي معلومات' : 'Personal Information'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label={t.fullName} icon={User} tooltip="Enter your full legal name as per CNIC">
                  <input autoFocus required type="text" className={inputClasses} placeholder={t.fullName} value={fullName} onChange={e => setFullName(e.target.value)} />
                </InputWrapper>
                <InputWrapper label={t.cnic} icon={CreditCard} tooltip="13-digit CNIC number without dashes">
                  <div className="space-y-3">
                    <input required type="text" className={inputClasses} placeholder="42101-XXXXXXX-X" value={cnic} onChange={e => setCnic(e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="file" className="hidden" ref={cnicFrontRef} onChange={e => handleFileChange(e, setCnicFront)} accept="image/*" />
                      <input type="file" className="hidden" ref={cnicBackRef} onChange={e => handleFileChange(e, setCnicBack)} accept="image/*" />
                      <CnicUploadButton label={t.cnicFront} file={cnicFront} onClick={() => cnicFrontRef.current?.click()} />
                      <CnicUploadButton label={t.cnicBack} file={cnicBack} onClick={() => cnicBackRef.current?.click()} />
                    </div>
                  </div>
                </InputWrapper>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label={t.email} icon={Mail} tooltip="We will send status updates to this email">
                  <input required type="email" className={inputClasses} placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} />
                </InputWrapper>
                <InputWrapper label={t.phone} icon={Phone} tooltip="For urgent contact regarding your complaint">
                  <input required type="tel" className={inputClasses} placeholder={t.phone} value={phone} onChange={e => setPhone(e.target.value)} />
                </InputWrapper>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label={t.postalAddress} icon={MapPin} tooltip="Your current mailing address">
                  <textarea required rows={3} className={inputClasses + " resize-none"} placeholder={t.postalAddress} value={postalAddress} onChange={e => setPostalAddress(e.target.value)} />
                </InputWrapper>
                <InputWrapper label={t.permanentAddress} icon={MapPin} tooltip="Your permanent address as per CNIC">
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox" 
                      id="sameAsPostal" 
                      checked={sameAsPostal} 
                      onChange={(e) => setSameAsPostal(e.target.checked)} 
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="sameAsPostal" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">{t.sameAsPostal}</label>
                  </div>
                  <textarea required rows={3} className={`${inputClasses} resize-none ${sameAsPostal ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder={t.permanentAddress} value={permanentAddress} onChange={e => setPermanentAddress(e.target.value)} disabled={sameAsPostal} />
                </InputWrapper>
              </div>
            </div>}

            {/* Section 2: Department & Officials */}
            {step === 2 && <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
              <h4 className={`text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest`}>2. {isRtl ? 'کاتي ۽ عملدارن جا تفصيل' : 'Department & Officials'}</h4>
              
              {/* Public Body Section */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
                <div className={`text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2`}>Public Body Details</div>
              <div className="grid grid-cols-1 gap-6">
                <InputWrapper label={t.publicBodyName || "Name of Public Body"} icon={Building2} tooltip="Select the Public Body you are complaining against">
                  <div className="space-y-4">
                    <div className="relative">
                      <select 
                        className={`${inputClasses} cursor-pointer`} 
                        required 
                        value={selectedPublicBody}
                        onChange={handlePublicBodyChange}
                      >
                        <option value="">{isRtl ? 'پبلڪ باڊي جي چونڊ ڪريو...' : 'Select Public Body...'}</option>
                        {groupedPublicBodies.map(([dept, bodies]) => (
                          <optgroup key={dept} label={dept}>
                            {bodies.map((pb) => {
                              // Check if this is the main department secretariat
                              const isSecretariat = pb.name_en === dept;
                              const suffix = isSecretariat ? (language === Language.UR ? ' (سیکریٹریٹ)' : language === Language.SD ? ' (سيڪريٽريٽ)' : ' (Secretariat)') : '';
                              
                              return (
                                <option key={pb.id} value={pb.id}>
                                  {(language === Language.UR ? (pb.name_ur || pb.name_en) : 
                                   language === Language.SD ? (pb.name_sd || pb.name_en) : 
                                   pb.name_en) + suffix}
                                </option>
                              );
                            })}
                          </optgroup>
                        ))}
                        <option value="other">✨ {t.other}</option>
                      </select>
                      {selectedPublicBody && !isOtherPublicBody && <Sparkles size={18} className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-blue-500 animate-pulse`} />}
                    </div>
                    {isOtherPublicBody && (
                      <input 
                        required 
                        type="text" 
                        className={inputClasses + " animate-in slide-in-from-top-2"} 
                        placeholder="Enter Public Body Name"
                        value={publicBodyName}
                        onChange={e => setPublicBodyName(e.target.value)}
                      />
                    )}
                  </div>
                </InputWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label={t.pioName} icon={UserCheck} tooltip="Name of the Public Information Officer (if known)">
                  <input required type="text" className={inputClasses} value={pioName} onChange={e => setPioName(e.target.value)} />
                </InputWrapper>
                <InputWrapper label={t.pioDesignation} icon={BadgeInfo}>
                  <input required type="text" className={inputClasses} value={pioDesignation} onChange={e => setPioDesignation(e.target.value)} />
                </InputWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWrapper label="Contact Number" icon={Phone} tooltip="Contact number of the Public Body">
                    <input type="text" className={inputClasses} value={publicBodyContact} onChange={e => setPublicBodyContact(e.target.value)} />
                  </InputWrapper>
                  <InputWrapper label="Public Body Address" icon={MapPin} tooltip="Address of the Public Body">
                    <input required type="text" className={inputClasses} value={deptAddress} onChange={e => setDeptAddress(e.target.value)} />
                  </InputWrapper>
                </div>
              </div>
              </div>

              {/* Department Section */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
                <div className={`text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2`}>Department Details</div>
                
                <InputWrapper label={t.dept} icon={Building2} tooltip="Select the administrative Department">
                  <div className="space-y-4">
                    <div className="relative">
                      <select 
                        className={`${inputClasses} cursor-pointer`} 
                        required 
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                      >
                        <option value="">{isRtl ? 'کاتي جي چونڊ ڪريو...' : 'Select Department...'}</option>
                        {uniqueDepartments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                        <option value="other">✨ {t.other}</option>
                      </select>
                    </div>
                    {isOtherDepartment && (
                      <input 
                        required 
                        type="text" 
                        className={inputClasses + " animate-in slide-in-from-top-2"} 
                        placeholder={t.customDept}
                        value={customDept}
                        onChange={e => setCustomDept(e.target.value)}
                      />
                    )}
                  </div>
                </InputWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label={t.hodName} icon={UserCheck} tooltip="Name of the Head of Department (if known)">
                  <input required type="text" className={inputClasses} value={hodName} onChange={e => setHodName(e.target.value)} />
                </InputWrapper>
                <InputWrapper label={t.hodDesignation} icon={BadgeInfo}>
                  <input required type="text" className={inputClasses} value={hodDesignation} onChange={e => setHodDesignation(e.target.value)} />
                </InputWrapper>
                </div>

                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputWrapper label="Contact Number" icon={Phone} tooltip="Contact number of the Department">
                      <input type="text" className={inputClasses} value={departmentContact} onChange={e => setDepartmentContact(e.target.value)} />
                    </InputWrapper>
                    <InputWrapper label={t.hodAddress} icon={MapPin} tooltip="Address of the Department">
                      <input required type="text" className={inputClasses} value={hodAddress} onChange={e => setHodAddress(e.target.value)} />
                    </InputWrapper>
                  </div>
                </div>
              </div>
            </div>}

            {/* Section 3: Grounds of Complaint */}
            {step === 3 && <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
              <h4 className={`text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest`}>3. {isRtl ? 'شڪايت جا بنياد' : 'Grounds of Complaint'}</h4>
              
              {/* Date Logic Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <InputWrapper label={t.initialRequestDate} icon={Calendar} tooltip="Date when you sent the first application">
                  <input 
                    required 
                    type="date" 
                    className={inputClasses} 
                    value={initialRequestDate} 
                    onChange={e => {
                        setInitialRequestDate(e.target.value);
                        setDateError('');
                    }} 
                  />
                </InputWrapper>
                <InputWrapper label={t.submissionMode} icon={Send} tooltip="How did you send the application?">
                  <select className={inputClasses} value={requestMode} onChange={e => setRequestMode(e.target.value)}>
                    <option value="COURIER">{t.courier}</option>
                    <option value="BY_HAND">{t.byHand}</option>
                  </select>
                </InputWrapper>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <InputWrapper label={t.internalReviewDate} icon={Calendar} tooltip="Date when you filed internal review">
                  <input 
                    required 
                    type="date" 
                    className={inputClasses} 
                    value={internalReviewDate} 
                    onChange={e => {
                        setInternalReviewDate(e.target.value);
                        setDateError('');
                    }} 
                  />
                </InputWrapper>
                <InputWrapper label={t.submissionMode} icon={Send} tooltip="How did you send the review application?">
                  <select className={inputClasses} value={reviewMode} onChange={e => setReviewMode(e.target.value)}>
                    <option value="COURIER">{t.courier}</option>
                    <option value="BY_HAND">{t.byHand}</option>
                  </select>
                </InputWrapper>
              </div>
              
              {dateError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">{dateError}</p>
                </div>
              )}

              <InputWrapper label={t.subject} icon={FileSignature} tooltip="Brief title of the information requested">
                <input required type="text" className={inputClasses} placeholder={t.subject} value={subject} onChange={e => setSubject(e.target.value)} />
              </InputWrapper>
              <InputWrapper label={t.details} icon={FileText} tooltip="Detailed description of information sought">
                <textarea 
                  required 
                  rows={5} 
                  className={inputClasses + " resize-none leading-relaxed"} 
                  placeholder={t.details} 
                  value={details} 
                  onChange={e => setDetails(e.target.value)}
                />
              </InputWrapper>
            </div>}

            {/* Section 4: Attachments */}
            {step === 4 && <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
              <h4 className={`text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest`}>4. {isRtl ? 'منسلڪ دستاويز' : 'Supporting Documents'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="file" className="hidden" ref={applicationFileRef} onChange={e => handleFileChange(e, setApplicationFile)} accept="application/pdf,image/*" />
                <input type="file" className="hidden" ref={applicationAckFileRef} onChange={e => handleFileChange(e, setApplicationAckFile)} accept="application/pdf,image/*" />
                <input type="file" className="hidden" ref={internalReviewFileRef} onChange={e => handleFileChange(e, setInternalReviewFile)} accept="application/pdf,image/*" />
                <input type="file" className="hidden" ref={internalReviewAckFileRef} onChange={e => handleFileChange(e, setInternalReviewAckFile)} accept="application/pdf,image/*" />
                
                <UploadZone 
                  title={t.uploadAppTitle} 
                  description={t.uploadAppDesc} 
                  file={applicationFile} 
                  onUploadClick={() => applicationFileRef.current?.click()} 
                />
                {requestMode !== 'BY_HAND' && (
                  <UploadZone 
                    title={t.uploadAppAckTitle} 
                    description={t.uploadAppAckDesc} 
                    file={applicationAckFile} 
                    onUploadClick={() => applicationAckFileRef.current?.click()} 
                  />
                )}
                <UploadZone 
                  title={t.uploadReviewTitle} 
                  description={t.uploadReviewDesc} 
                  file={internalReviewFile} 
                  onUploadClick={() => internalReviewFileRef.current?.click()} 
                />
                {reviewMode !== 'BY_HAND' && (
                  <UploadZone 
                    title={t.uploadReviewAckTitle} 
                    description={t.uploadReviewAckDesc} 
                    file={internalReviewAckFile} 
                    onUploadClick={() => internalReviewAckFileRef.current?.click()} 
                  />
                )}
              </div>
            </div>}

            {/* Declaration & Submit */}
            {step === 5 && <div className="animate-in fade-in duration-300 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                 <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t.reviewComplaintTitle}</h3>
                 <button type="button" onClick={handlePrint} className="p-3 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Print Review">
                    <Printer size={20} />
                 </button>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-3 text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">
                  <User size={18} />
                  {t.personalDetails}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <ReviewItem label={t.fullName} value={fullName} />
                  <ReviewItem label={t.cnic} value={cnic} />
                  <ReviewItem label={t.email} value={email} />
                  <ReviewItem label={t.phone} value={phone} />
                  <div className="md:col-span-2">
                    <ReviewItem label={t.postalAddress} value={postalAddress} isParagraph={true} />
                  </div>
                  <div className="md:col-span-2">
                    <ReviewItem label={t.permanentAddress} value={permanentAddress} isParagraph={true} />
                  </div>
                </div>
              </div>

              {/* Complaint Details */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-3 text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">
                  <FileText size={18} />
                  {t.complaintDetails}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="md:col-span-2">
                    <ReviewItem label={t.dept} value={selectedDepartment === 'other' ? customDept : selectedDepartment} />
                  </div>
                  <ReviewItem label={t.publicBodyName} value={selectedPublicBody === 'other' ? publicBodyName : publicBodies.find(b => String(b.id) === selectedPublicBody)?.name_en} />
                  <div className="md:col-span-2">
                    <ReviewItem label={t.subject} value={subject} />
                  </div>
                  <div className="md:col-span-2">
                    <ReviewItem label={t.details} value={details} isParagraph={true} />
                  </div>
                </div>
              </div>

              {/* Attached Documents */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-3 text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Upload size={18} />
                  {t.attachedDocuments}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cnicFront && <FileListItem fileName={cnicFront.name} label={t.cnicFront} />}
                  {cnicBack && <FileListItem fileName={cnicBack.name} label={t.cnicBack} />}
                  {applicationFile && <FileListItem fileName={applicationFile.name} label={t.uploadAppTitle} />}
                  {applicationAckFile && <FileListItem fileName={applicationAckFile.name} label={t.uploadAppAckTitle} />}
                  {internalReviewFile && <FileListItem fileName={internalReviewFile.name} label={t.uploadReviewTitle} />}
                  {internalReviewAckFile && <FileListItem fileName={internalReviewAckFile.name} label={t.uploadReviewAckTitle} />}
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50 flex gap-3">
                <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                  {t.reviewWarning}
                </p>
              </div>

              <div className={`flex items-start gap-4 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 ${textAlignClass}`}>
                <input type="checkbox" required className="mt-1 h-5 w-5 rounded-lg text-blue-600 border-2 border-slate-200 focus:ring-blue-500/20 cursor-pointer" />
                <p className={`text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed ${isComplexScript ? 'text-base' : ''}`}>
                  {t.declaration}
                </p>
              </div>
            </div>}

            {/* Navigation */}
            <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-3xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                  {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                  <span className="uppercase tracking-widest text-sm hidden md:inline">{isRtl ? 'پوئتي' : 'Back'}</span>
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl active:scale-95 group"
                >
                  <span className="text-lg uppercase tracking-widest">{isRtl ? 'اڳيون' : 'Next'}</span>
                  {isRtl ? <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> : <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 dark:bg-blue-800 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl active:scale-95 group"
                >
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} className={`group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />}
                  <span className="text-lg uppercase tracking-widest">{isSubmitting ? (t.submittingStatus || 'Submitting...') : t.submit}</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Instruction Sidebar */}
        <aside className="lg:w-[32%] bg-slate-50 dark:bg-slate-950 p-4 lg:p-6 border-b lg:border-b-0 lg:border-s border-slate-200 dark:border-slate-800">
          <div className="sticky top-6 space-y-6">
            <div>
              <h3 className={`${isComplexScript ? 'text-3xl' : 'text-xl'} font-black mb-4 leading-tight tracking-tight text-slate-800 dark:text-amber-400 uppercase ${textAlignClass}`}>{t.beforeFile}</h3>
              <div className="space-y-4">
                <div className={`flex items-start gap-3`}>
                  <div className="p-2 bg-white dark:bg-slate-800/80 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <FileSignature size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className={textAlignClass}>
                    <h4 className={`font-black ${isComplexScript ? 'text-lg' : 'text-xs'} mb-0.5 uppercase tracking-wide text-slate-800 dark:text-slate-100`}>{t.beSpecific}</h4>
                    <p className={`${isComplexScript ? 'text-sm' : 'text-[10px]'} text-slate-500 dark:text-slate-400 leading-relaxed font-medium`}>{t.beSpecificDesc}</p>
                  </div>
                </div>

                <div className={`flex items-start gap-3`}>
                  <div className="p-2 bg-white dark:bg-slate-800/80 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <CreditCard size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className={textAlignClass}>
                    <h4 className={`font-black ${isComplexScript ? 'text-lg' : 'text-xs'} mb-0.5 uppercase tracking-wide text-slate-800 dark:text-slate-100`}>{t.costCopy}</h4>
                    <p className={`${isComplexScript ? 'text-sm' : 'text-[10px]'} text-slate-500 dark:text-slate-400 leading-relaxed font-medium`}>{t.costCopyDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className={`flex items-center gap-2 mb-3 ${textAlignClass}`}>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                  <Scale size={16} />
                </div>
                <h3 className={`${isComplexScript ? 'text-lg' : 'text-xs'} font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest`}>{t.applicationProcedure || 'Application Procedure'}</h3>
              </div>
              
              <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
                 <div 
                   className="flex transition-transform duration-700 ease-in-out" 
                   style={{ transform: `translateX(${isRtl ? '' : '-'}${currentProcedureStep * 100}%)` }}
                 >
                    {procedureSteps.map((stepText, index) => (
                        <div key={index} className="w-full shrink-0 p-5 pb-8 box-border">
                            <p className={`${isComplexScript ? 'text-base' : 'text-[10px]'} leading-relaxed text-slate-600 dark:text-slate-400 font-medium ${textAlignClass}`}>
                               <strong className={`text-indigo-600 dark:text-indigo-400 block mb-1.5 ${isComplexScript ? 'text-sm' : 'text-xs'}`}>Step {index + 1}</strong>
                               {stepText}
                            </p>
                        </div>
                    ))}
                 </div>
                 
                 <div className="flex justify-center gap-1.5 pb-3 absolute bottom-0 left-0 right-0">
                    {procedureSteps.map((_, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setCurrentProcedureStep(idx)}
                          className={`h-1 rounded-full transition-all duration-300 ${idx === currentProcedureStep ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-indigo-300'}`}
                        />
                    ))}
                 </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className={`flex items-center gap-2 mb-3 ${textAlignClass}`}>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 shadow-sm">
                  <FileText size={16} />
                </div>
                <h3 className={`${isComplexScript ? 'text-lg' : 'text-xs'} font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest`}>{isRtl ? 'شکايت داخل ڪرڻ جو طريقو' : 'Step-by-Step Procedure'}</h3>
              </div>
              <div className="space-y-3">
                {[t.internalReviewTitle, t.commissionAppealTitle].map((title, i) => (
                  <div key={i} className={`p-3 bg-white dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${textAlignClass}`}>
                    <h4 className={`${isComplexScript ? 'text-base' : 'text-[10px]'} font-black mb-0.5 text-slate-800 dark:text-white uppercase tracking-wider`}>{title}</h4>
                    <p className={`${isComplexScript ? 'text-sm' : 'text-[9px]'} text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic`}>
                      {i === 0 ? t.internalReviewDesc : t.commissionAppealDesc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm">
               <div className={`flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400`}>
                 <AlertCircle size={16} />
                 <span className={`${isComplexScript ? 'text-base' : 'text-[9px]'} font-black uppercase tracking-[0.2em]`}>Helpline</span>
               </div>
               <p className={`${isComplexScript ? 'text-lg' : 'text-[10px]'} text-slate-600 dark:text-slate-300 leading-relaxed font-bold ${textAlignClass}`}>
                 {isRtl ? 'پريشان آهيو؟ مدد لاءِ 9920XXXX (021) تي ڪال ڪريو.' : 'Confused? Call (021) 9920XXXX for assistance.'}
               </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
