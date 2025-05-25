"use client"

import { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

// Define breakpoints that match Tailwind's default breakpoints
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const matches = useMediaQuery({ minWidth: breakpoints[breakpoint] })
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only returning the match value after mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? matches : false
}

export function useResponsive() {
  const isMobile = useMediaQuery({ maxWidth: breakpoints.sm - 1 })
  const isTablet = useMediaQuery({ minWidth: breakpoints.sm, maxWidth: breakpoints.lg - 1 })
  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg })
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Return false for all values during SSR to avoid hydration mismatch
  if (!mounted) {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      currentBreakpoint: null as Breakpoint | null,
    }
  }

  // Determine current breakpoint
  let currentBreakpoint: Breakpoint = "xs"
  if (isDesktop) currentBreakpoint = "lg"
  else if (isTablet) currentBreakpoint = "md"
  else currentBreakpoint = "sm"

  return {
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
  }
}

// Hook to set viewport height CSS variable
export function useViewportHeight() {
  useEffect(() => {
    // Function to update the viewport height
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    // Set the height initially
    updateHeight()

    // Update the height on resize
    window.addEventListener("resize", updateHeight)

    // Clean up
    return () => window.removeEventListener("resize", updateHeight)
  }, [])
}
