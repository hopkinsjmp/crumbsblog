import fs from 'fs';
import path from 'path';

export interface GlobalTheme {
  color?: string;
  font?: string;
  darkMode?: string;
  primaryColor?: string;
  accentColor?: string;
  headingFont?: string;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface GlobalHeader {
  name?: string;
  color?: string;
  nav?: NavItem[];
  icon?: { name?: string; color?: string; style?: string };
}

export interface SocialLink {
  icon?: { name?: string };
  url?: string;
}

export interface GlobalFooter {
  social?: SocialLink[];
}

export interface GlobalSettings {
  header?: GlobalHeader;
  footer?: GlobalFooter;
  theme?: GlobalTheme;
}

export function getGlobalSettings(): GlobalSettings {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'content/global/index.json'),
      'utf8'
    );
    return JSON.parse(raw) as GlobalSettings;
  } catch {
    return {};
  }
}
