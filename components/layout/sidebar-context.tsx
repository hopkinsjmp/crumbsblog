"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sidebar state from localStorage or screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    
    // Try to get saved preference from localStorage
    const savedState = localStorage.getItem("sidebar-open");
    
    if (savedState !== null) {
      // User has a saved preference
      setIsOpen(savedState === "true");
    } else {
      // No saved preference, use screen size
      setIsOpen(mediaQuery.matches);
    }
    
    setIsInitialized(true);
  }, []);

  // Sync with screen size changes
  useEffect(() => {
    if (!isInitialized) return;

    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleScreenChange = () => {
      const savedState = localStorage.getItem("sidebar-open");
      
      // Only auto-sync if user hasn't manually set a preference
      if (savedState === null) {
        setIsOpen(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, [isInitialized]);

  // Persist state changes to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("sidebar-open", String(isOpen));
    }
  }, [isOpen, isInitialized]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleToggle = () => setIsOpen((v) => !v);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        open: handleOpen,
        close: handleClose,
        toggle: handleToggle,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
