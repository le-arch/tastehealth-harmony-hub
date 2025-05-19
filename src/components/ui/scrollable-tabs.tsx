
import React, { useRef, useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "./scrollable-tabs.css";

interface ScrollableTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
  showScrollButtons?: boolean;
}

export const ScrollableTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  ScrollableTabsListProps
>(({ className, showScrollButtons = true, children, ...props }, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    // Check on initial render and whenever children change
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll);
    }
    
    // Add resize listener for responsive behavior
    const resizeObserver = new ResizeObserver(checkScroll);
    if (scrollElement) {
      resizeObserver.observe(scrollElement);
    }
    
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", checkScroll);
        resizeObserver.disconnect();
      }
    };
  }, [children]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <TabsList
        ref={(el) => {
          // Merge refs
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
          scrollRef.current = el;
        }}
        className={cn("scrollable-tabs-list", className)}
        {...props}
      >
        {children}
      </TabsList>
      {showScrollButtons && (
        <>
          {showLeftArrow && (
            <button 
              className="tabs-scroll-button tabs-scroll-prev" 
              onClick={scrollLeft}
              type="button"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {showRightArrow && (
            <button 
              className="tabs-scroll-button tabs-scroll-next" 
              onClick={scrollRight}
              type="button"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
});

ScrollableTabsList.displayName = "ScrollableTabsList";

export { Tabs, TabsTrigger };
