
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('en');

  // Load saved language from localStorage and user settings on initial load
  useEffect(() => {
    const loadLanguageSettings = async () => {
      // First check local storage
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
      
      // Then check if user is logged in and has settings
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session && session.session) {
          const { data: userSettings } = await supabase
            .from('user_settings')
            .select('language')
            .eq('user_id', session.session.user.id)
            .maybeSingle();
          
          if (userSettings && userSettings.language) {
            setLanguage(userSettings.language);
            localStorage.setItem('language', userSettings.language);
          }
        }
      } catch (error) {
        console.error('Error loading language settings:', error);
      }
    };
    
    loadLanguageSettings();
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Set HTML lang attribute for accessibility
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
