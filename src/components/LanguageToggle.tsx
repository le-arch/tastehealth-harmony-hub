import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const next = language === 'en' ? 'fr' : 'en';
  const flag = language === 'en' ? '🇬🇧' : '🇫🇷';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileTap={{ scale: 0.92 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(next)}
              className="h-9 px-2 gap-1 rounded-full hover:bg-primary/10"
              aria-label="Toggle language"
            >
              <Languages className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase">{flag} {language}</span>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          Switch to {next === 'en' ? 'English' : 'Français'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageToggle;
