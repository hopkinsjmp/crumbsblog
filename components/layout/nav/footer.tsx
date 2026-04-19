"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "../../icon";
import { useLayout } from "../layout-context";

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header } = globalSettings!;

  return (
    <footer className="border-t border-[#2c1d14]/20 bg-[#d5dbc5] pt-10 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-12 flex items-center border-t py-6">
          <Link href="/" aria-label="go home">
            <Icon
              parentColor={header!.color!}
              data={header!.icon}
            />
          </Link>
          <span className="self-center text-muted-foreground text-sm ml-2">© {new Date().getFullYear()} {header?.name}, All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
