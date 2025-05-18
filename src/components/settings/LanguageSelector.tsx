
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  label: string;
  englishLabel: string;
  frenchLabel: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  label,
  englishLabel,
  frenchLabel,
}) => {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex space-x-2 mt-1.5">
        <Button
          variant={currentLanguage === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onLanguageChange('en')}
        >
          {englishLabel}
        </Button>
        <Button
          variant={currentLanguage === 'fr' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onLanguageChange('fr')}
        >
          {frenchLabel}
        </Button>
      </div>
    </div>
  );
};
