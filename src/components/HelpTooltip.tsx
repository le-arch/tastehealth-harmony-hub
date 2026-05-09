import React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useT } from "@/hooks/useTranslate";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  text: string;
  className?: string;
  size?: number;
}

/** Small (?) icon that shows a tooltip with translated guidance. */
const HelpTooltip: React.FC<HelpTooltipProps> = ({ text, className, size = 14 }) => {
  const translated = useT(text);
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Help"
            className={cn(
              "inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors",
              className
            )}
            onClick={(e) => e.preventDefault()}
          >
            <HelpCircle style={{ width: size, height: size }} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {translated}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;
