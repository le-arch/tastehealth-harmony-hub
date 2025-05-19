
import React, { useRef, useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "./scrollable-tabs.css";

interface ScrollableTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
  showScrollButtons?: boolean;
  scrollAmount?: number;
}

export const ScrollableTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  ScrollableTabsListProps
>(({ className, showScrollButtons = true, scrollAmount = 120, children, ...props }, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

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
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
      // Center active tab on resize
      if (scrollElement) {
        const activeTab = scrollElement.querySelector('[data-state="active"]');
        if (activeTab) {
          centerActiveTab(activeTab as HTMLElement);
        }
      }
    });
    
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
  
  // Center the active tab when it changes
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-state') {
            const activeTab = scrollElement.querySelector('[data-state="active"]');
            if (activeTab) {
              centerActiveTab(activeTab as HTMLElement);
            }
          }
        });
      });
      
      observer.observe(scrollElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-state']
      });
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  const centerActiveTab = (activeTab: HTMLElement) => {
    if (scrollRef.current && activeTab) {
      const container = scrollRef.current;
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const targetScrollLeft = activeTab.offsetLeft - (containerRect.width / 2) + (tabRect.width / 2);
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current && !isScrolling) {
      setIsScrolling(true);
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current && !isScrolling) {
      setIsScrolling(true);
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(() => setIsScrolling(false), 300);
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
          <button 
            className={cn(
              "tabs-scroll-button tabs-scroll-prev", 
              !showLeftArrow && "tabs-hidden"
            )}
            onClick={scrollLeft}
            type="button"
            aria-label="Scroll left"
            disabled={!showLeftArrow || isScrolling}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            className={cn(
              "tabs-scroll-button tabs-scroll-next", 
              !showRightArrow && "tabs-hidden"
            )}
            onClick={scrollRight}
            type="button"
            aria-label="Scroll right"
            disabled={!showRightArrow || isScrolling}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
});

ScrollableTabsList.displayName = "ScrollableTabsList";

export { Tabs, TabsTrigger };
