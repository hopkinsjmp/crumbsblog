"use client";
import React, { useState, useContext } from "react";
import type { GlobalSettings, GlobalTheme } from "@/lib/global";

export interface RecentPost {
  title: string;
  url: string;
  heroImg?: string | null;
}

interface LayoutState {
  globalSettings: GlobalSettings;
  setGlobalSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  pageData: {};
  setPageData: React.Dispatch<React.SetStateAction<{}>>;
  theme: GlobalTheme;
  recentPosts: RecentPost[];
}

const LayoutContext = React.createContext<LayoutState | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  return (
    context || {
      theme: {
        color: "orange",
        darkMode: "light",
      } as GlobalTheme,
      globalSettings: undefined as unknown as GlobalSettings,
      pageData: undefined,
      recentPosts: [],
    }
  );
};

interface LayoutProviderProps {
  children: React.ReactNode;
  globalSettings: GlobalSettings;
  pageData: {};
  recentPosts: RecentPost[];
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  globalSettings: initialGlobalSettings,
  pageData: initialPageData,
  recentPosts,
}) => {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(
    initialGlobalSettings
  );
  const [pageData, setPageData] = useState<{}>(initialPageData);

  const theme: GlobalTheme = globalSettings.theme ?? { color: 'orange', darkMode: 'light' };

  return (
    <LayoutContext.Provider
      value={{
        globalSettings,
        setGlobalSettings,
        pageData,
        setPageData,
        theme,
        recentPosts,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
