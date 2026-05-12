import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useT } from "@/hooks/useTranslate";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  text: string;
  className?: string;
  size?: number;
  label?: string;
}

/**
 * Accessible help indicator: keyboard-focusable, screen-reader friendly,
 * works on hover (desktop) AND tap (mobile) via Popover.
 */
const HelpTooltip: React.FC<HelpTooltipProps> = ({ text, className, size = 14, label }) => {
  const translated = useT(text);
  const aria = useT(label || "Help");
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={aria}
          aria-describedby="help-tooltip-content"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }}
          className={cn(
            "inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-colors",
            className
          )}
        >
          <HelpCircle style={{ width: size, height: size }} aria-hidden="true" />
          <span className="sr-only">{aria}: {translated}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        id="help-tooltip-content"
        side="top"
        role="tooltip"
        className="max-w-xs text-xs px-3 py-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {translated}
      </PopoverContent>
    </Popover>
  );
};

export default HelpTooltip;
