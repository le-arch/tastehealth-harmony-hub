
import * as React from "react";

const BREAKPOINTS = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useScreenSize() {
  const [screenData, setScreenData] = React.useState<{
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isSmallMobile: boolean;
    orientation: "portrait" | "landscape";
  }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false, 
    isDesktop: false,
    isSmallMobile: false,
    orientation: "portrait"
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenData({
        width,
        height,
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg,
        isSmallMobile: width < BREAKPOINTS.sm,
        orientation: height > width ? "portrait" : "landscape"
      });
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenData;
}

export function useIsMobile() {
  const { isMobile } = useScreenSize();
  return isMobile;
}

export function useIsTablet() {
  const { isTablet } = useScreenSize();
  return isTablet;
}

export function useIsDesktop() {
  const { isDesktop } = useScreenSize();
  return isDesktop;
}

export function useIsSmallMobile() {
  const { isSmallMobile } = useScreenSize();
  return isSmallMobile;
}

export function useOrientation() {
  const { orientation } = useScreenSize();
  return orientation;
}

export function useResponsiveValue<T>(
  mobileValue: T,
  tabletValue: T = mobileValue,
  desktopValue: T = tabletValue
): T {
  const { isMobile, isTablet } = useScreenSize();

  if (isMobile) return mobileValue;
  if (isTablet) return tabletValue;
  return desktopValue;
}

export default {
  useScreenSize,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsSmallMobile,
  useOrientation,
  useResponsiveValue,
  BREAKPOINTS
};
