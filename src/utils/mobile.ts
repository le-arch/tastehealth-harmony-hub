"use client";

import { useEffect, useState } from "react";

// Screen size breakpoints (matching Tailwind's default breakpoints)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export type Breakpoint = keyof typeof breakpoints;

// Hook to detect current screen size
export function useScreenSize() {
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: screenWidth,
    isMobile: screenWidth < breakpoints.md,
    isTablet: screenWidth >= breakpoints.md && screenWidth < breakpoints.lg,
    isDesktop: screenWidth >= breakpoints.lg,
    isSmallScreen: screenWidth < breakpoints.sm,
    isMediumScreen:
      screenWidth >= breakpoints.md && screenWidth < breakpoints.lg,
    isLargeScreen:
      screenWidth >= breakpoints.lg && screenWidth < breakpoints.xl,
    isExtraLargeScreen: screenWidth >= breakpoints.xl,
  };
}

// Hook to detect if the screen is mobile
export function useMobile() {
  const { isMobile } = useScreenSize();
  return isMobile;
}

// Hook to detect if the screen is tablet
export function useTablet() {
  const { isTablet } = useScreenSize();
  return isTablet;
}

// Hook to detect if the screen is desktop
export function useDesktop() {
  const { isDesktop } = useScreenSize();
  return isDesktop;
}

// Hook to detect orientation
export function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
        ? "portrait"
        : "landscape"
      : "portrait"
  );

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    // Set initial orientation
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return orientation;
}

// Utility function to get responsive class names based on screen size
export function getResponsiveClasses({
  base,
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
}: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
}) {
  return [
    base,
    sm ? `sm:${sm}` : "",
    md ? `md:${md}` : "",
    lg ? `lg:${lg}` : "",
    xl ? `xl:${xl}` : "",
    xxl ? `2xl:${xxl}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

// Utility function to get responsive padding
export function getResponsivePadding({
  base = "p-4",
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
}: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
} = {}) {
  return getResponsiveClasses({ base, sm, md, lg, xl, "2xl": xxl });
}

// Utility function to get responsive margin
export function getResponsiveMargin({
  base = "m-4",
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
}: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
} = {}) {
  return getResponsiveClasses({ base, sm, md, lg, xl, "2xl": xxl });
}

// Utility function to get responsive grid columns
export function getResponsiveGridCols({
  base = "grid-cols-1",
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
}: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
} = {}) {
  return getResponsiveClasses({ base, sm, md, lg, xl, "2xl": xxl });
}

// Utility function to get responsive flex direction
export function getResponsiveFlexDirection({
  base = "flex-col",
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
}: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
} = {}) {
  return getResponsiveClasses({ base, sm, md, lg, xl, "2xl": xxl });
}

// Utility function to get responsive font size
export function getResponsiveFontSize({
  base = "text-base",
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
}: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
} = {}) {
  return getResponsiveClasses({ base, sm, md, lg, xl, "2xl": xxl });
}

// Utility function to get responsive width
export function getResponsiveWidth({
  base = "w-full",
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
}: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
} = {}) {
  return getResponsiveClasses({ base, sm, md, lg, xl, "2xl": xxl });
}

// Utility function to get responsive height
export function getResponsiveHeight({
  base = "h-auto",
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
}: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
} = {}) {
  return getResponsiveClasses({ base, sm, md, lg, xl, "2xl": xxl });
}

// Common responsive layouts
export const responsiveLayouts = {
  // Container with responsive padding
  container: "w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto",

  // Grid layouts
  grid: {
    // 1 column on mobile, 2 on tablet, 3 on desktop
    basic: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",

    // 1 column on mobile, 2 on tablet, 4 on desktop
    quad: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6",

    // 1 column on mobile, 3 on desktop
    triple: "grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6",

    // 1 column on mobile, 2 on desktop
    double: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6",
  },

  // Flex layouts
  flex: {
    // Column on mobile, row on desktop
    colToRow: "flex flex-col lg:flex-row gap-4 md:gap-6",

    // Row on mobile, column on desktop
    rowToCol: "flex flex-row lg:flex-col gap-4 md:gap-6",

    // Centered content
    center: "flex items-center justify-center",

    // Space between items
    spaceBetween: "flex items-center justify-between",
  },

  // Text sizes
  text: {
    // Responsive heading
    heading: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold",

    // Responsive subheading
    subheading: "text-lg sm:text-xl md:text-2xl font-semibold",

    // Responsive body text
    body: "text-sm sm:text-base md:text-lg",
  },

  // Spacing
  spacing: {
    // Section spacing
    section: "my-6 sm:my-8 md:my-12 lg:my-16",

    // Component spacing
    component: "my-4 sm:my-6 md:my-8",
  },

  // Hide on specific screen sizes
  hide: {
    mobile: "hidden md:block",
    desktop: "md:hidden",
    tablet: "sm:hidden lg:block",
  },

  // Show on specific screen sizes
  show: {
    mobileOnly: "block md:hidden",
    tabletOnly: "hidden sm:block lg:hidden",
    desktopOnly: "hidden lg:block",
  },
};

// Utility function to apply responsive styles based on screen size
export function useResponsiveStyles() {
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  return {
    applyStyle: <T>(
      mobileStyle: T,
      tabletStyle: T = mobileStyle,
      desktopStyle: T = tabletStyle
    ): T => {
      if (isDesktop) return desktopStyle;
      if (isTablet) return tabletStyle;
      return mobileStyle;
    },
  };
}

// Utility function to get a value based on screen size
export function useResponsiveValue<T>(
  mobileValue: T,
  tabletValue: T = mobileValue,
  desktopValue: T = tabletValue
): T {
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  if (isDesktop) return desktopValue;
  if (isTablet) return tabletValue;
  return mobileValue;
}

// Common responsive component props
export interface ResponsiveProps {
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

// Utility function to combine responsive class names
export function combineResponsiveClasses({
  className = "",
  mobileClassName = "",
  tabletClassName = "",
  desktopClassName = "",
}: ResponsiveProps): string {
  return [
    className,
    mobileClassName ? `${mobileClassName} md:hidden` : "",
    tabletClassName ? `hidden md:${tabletClassName} lg:hidden` : "",
    desktopClassName ? `hidden lg:${desktopClassName}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

// Utility function to handle safe area insets (for mobile devices with notches)
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Check if the CSS environment variables are supported
    const computedStyle = window.getComputedStyle(document.documentElement);

    const getInsetValue = (property: string): number => {
      const value = computedStyle.getPropertyValue(property);
      return value ? Number.parseInt(value, 10) : 0;
    };

    setInsets({
      top: getInsetValue("--sat") || 0,
      right: getInsetValue("--sar") || 0,
      bottom: getInsetValue("--sab") || 0,
      left: getInsetValue("--sal") || 0,
    });

    // Add CSS variables for safe area insets if they don't exist
    if (!document.querySelector("#safe-area-css")) {
      const style = document.createElement("style");
      style.id = "safe-area-css";
      style.innerHTML = `
        :root {
          --sat: env(safe-area-inset-top, 0px);
          --sar: env(safe-area-inset-right, 0px);
          --sab: env(safe-area-inset-bottom, 0px);
          --sal: env(safe-area-inset-left, 0px);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return insets;
}

// Utility classes for safe area insets
export const safeAreaClasses = {
  paddingTop: "pt-[var(--sat)]",
  paddingRight: "pr-[var(--sar)]",
  paddingBottom: "pb-[var(--sab)]",
  paddingLeft: "pl-[var(--sal)]",
  paddingX: "px-[var(--sal)] pr-[var(--sar)]",
  paddingY: "pt-[var(--sat)] pb-[var(--sab)]",
  padding: "pt-[var(--sat)] pr-[var(--sar)] pb-[var(--sab)] pl-[var(--sal)]",
};

// Utility function to detect if the device supports touch
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    setIsTouch(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    );
  }, []);

  return isTouch;
}

// Utility function to handle viewport height issues on mobile browsers
export function useViewportHeight() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Function to update CSS variable with the viewport height
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Set initial viewport height
    updateViewportHeight();

    // Update on resize
    window.addEventListener("resize", updateViewportHeight);

    // Clean up
    return () => window.removeEventListener("resize", updateViewportHeight);
  }, []);

  // Return CSS value to use instead of vh units
  return "calc(var(--vh, 1vh) * 100)";
}

// Example usage: height: ${useViewportHeight()};
// Or with Tailwind: className="h-[calc(var(--vh,1vh)*100)]"

export default {
  breakpoints,
  useScreenSize,
  useMobile,
  useTablet,
  useDesktop,
  useOrientation,
  getResponsiveClasses,
  getResponsivePadding,
  getResponsiveMargin,
  getResponsiveGridCols,
  getResponsiveFlexDirection,
  getResponsiveFontSize,
  getResponsiveWidth,
  getResponsiveHeight,
  responsiveLayouts,
  useResponsiveStyles,
  useResponsiveValue,
  combineResponsiveClasses,
  useSafeAreaInsets,
  safeAreaClasses,
  useIsTouchDevice,
  useViewportHeight,
};
