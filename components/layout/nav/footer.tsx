"use client";
import React from "react";
import { useLayout } from "../layout-context";

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header } = globalSettings!;

  return (
    <footer className="border-t border-[#2c1d14]/20 bg-[#d5dbc5] pt-10 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-12 flex items-center border-t py-6">
          <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} {header?.name}, All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
