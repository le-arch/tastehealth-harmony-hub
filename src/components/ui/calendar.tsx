import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  animated?: boolean;
  showWeekNumbers?: boolean;
  highlightToday?: boolean;
};

// Animation variants
const calendarVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 25,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

const monthVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const dayVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 17 } },
  tap: { scale: 0.95 }
};

const weekDayVariants = {
  initial: { opacity: 0, y: -10 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03 }
  })
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  animated = true,
  showWeekNumbers = false,
  highlightToday = true,
  ...props
}: CalendarProps) {
  const [direction, setDirection] = React.useState(0);
  const [month, setMonth] = React.useState<Date>(props.month || new Date());

  const handleMonthChange = (newMonth: Date) => {
    const newDirection = newMonth > month ? 1 : -1;
    setDirection(newDirection);
    setMonth(newMonth);
    props.onMonthChange?.(newMonth);
  };

  const Wrapper = animated ? motion.div : React.Fragment;
  const wrapperProps = animated ? {
    variants: calendarVariants,
    initial: "initial",
    animate: "animate",
    exit: "exit"
  } : {};

  // Get today's date for special styling
  const today = new Date();
  const isToday = (date: Date) => 
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <Wrapper {...wrapperProps} className="relative">
      {/* Decorative background elements */}
      {animated && (
        <>
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-blue-500/5 via-purple-500/10 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </>
      )}

      {/* Calendar Header Decoration */}
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Sparkles className="h-3 w-3 text-yellow-500" />
        <span>Plan your meals</span>
        <Sparkles className="h-3 w-3 text-yellow-500" />
      </motion.div>

      <DayPicker
        showOutsideDays={showOutsideDays}
        month={month}
        onMonthChange={handleMonthChange}
        className={cn(
          "p-3 relative z-10",
          animated && "overflow-hidden",
          className
        )}
        classNames={{
          months: cn(
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            animated && "relative"
          ),
          month: cn(
            "space-y-4",
            animated && "relative"
          ),
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-transparent p-0 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300",
            animated && "hover:scale-110 active:scale-95"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex justify-between mb-2",
          head_cell: cn(
            "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem] uppercase tracking-wider",
            animated && "relative"
          ),
          row: "flex w-full mt-2 justify-between",
          cell: cn(
            "h-9 w-9 text-center text-sm p-0 relative",
            "first:rounded-l-md last:rounded-r-md",
            "focus-within:relative focus-within:z-20",
            animated && "transition-all duration-200"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal rounded-full transition-all",
            animated && "hover:scale-110 active:scale-95 hover:bg-primary/10"
          ),
          day_range_end: "day-range-end",
          day_selected: cn(
            "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
            "hover:from-primary/90 hover:to-primary/70",
            "focus:bg-primary focus:text-primary-foreground",
            "shadow-lg shadow-primary/30",
            animated && "scale-110"
          ),
          day_today: cn(
            "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
            "text-amber-600 dark:text-amber-400",
            "border border-amber-500/30",
            "font-semibold",
            animated && "relative overflow-hidden"
          ),
          day_outside: cn(
            "day-outside text-muted-foreground/50",
            "aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30"
          ),
          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => (
            <motion.div
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
            </motion.div>
          ),
          IconRight: ({ ..._props }) => (
            <motion.div
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          ),
          Day: ({ date, ...dayProps }) => {
            const isTodayDate = isToday(date);
            const selected = props.selected;
            const isSelected = Array.isArray(selected)
              ? selected.some((d): d is Date => d instanceof Date && d.toDateString() === date.toDateString())
              : selected instanceof Date
                ? selected.toDateString() === date.toDateString()
                : false;

            return (
              <motion.button
                variants={animated ? dayVariants : undefined}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                className={cn(
                  "relative w-full h-full flex items-center justify-center",
                  isTodayDate && highlightToday && "today-highlight"
                )}
                {...dayProps}
              >
                {isTodayDate && highlightToday && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </>
                )}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    layoutId="selectedDay"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{date.getDate()}</span>
              </motion.button>
            );
          },
          DayContent: (props) => {
            // This is handled by the Day component above
            return <>{props.date.getDate()}</>;
          },
        }}
        {...props}
      />

      {/* Week Numbers Column (if enabled) */}
      {showWeekNumbers && (
        <motion.div
          className="absolute left-0 top-12 bottom-0 w-8 flex flex-col items-center pt-8 space-y-2 text-xs text-muted-foreground/50 border-r border-border/30"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[1, 2, 3, 4, 5, 6].map((week) => (
            <motion.span
              key={week}
              className="h-9 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + week * 0.02 }}
            >
              W{week}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Month Transition Indicator */}
      <AnimatePresence mode="wait">
        {animated && direction !== 0 && (
          <motion.div
            key={month.getMonth()}
            variants={monthVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-primary/5 to-transparent"
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Decorative Bottom Bar */}
      <motion.div
        className="mt-4 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
    </Wrapper>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };