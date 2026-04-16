import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface Logo {
  name: string;
  logo_image: string;
}

interface WebsiteLogoProps {
  className?: string;
}

export const WebsiteLogo: React.FC<WebsiteLogoProps> = ({ className }) => {
  const [logo, setLogo] = useState<Logo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/logo/`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setLogo(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch website logo", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  const defaultImgClasses = "h-24 w-auto max-w-full object-contain mx-auto rounded-2xl";
  const defaultLoadingClasses = "h-24 w-full bg-slate-200 dark:bg-slate-800 animate-pulse mx-auto rounded-2xl";

  if (loading) {
    return <div className={className ? `bg-slate-200 dark:bg-slate-800 animate-pulse ${className}` : defaultLoadingClasses}></div>;
  }

  if (logo && logo.logo_image) {
    const logoUrl = logo.logo_image.startsWith('http') ? logo.logo_image : `${API_BASE_URL}${logo.logo_image}`;
    return <img src={logoUrl} alt={logo.name} className={className || defaultImgClasses} />;
  }

  // Fallback to default text logo if no image is uploaded
  if (className) {
    // If a custom class is passed, assume it's for a smaller container and use a smaller text fallback
    return <div className={`flex items-center justify-center ${className}`}>
      <span className="text-sm font-black text-amber-400">SIC</span>
    </div>;
  }
  return <span className="text-2xl font-black text-amber-400">SIC</span>;
};