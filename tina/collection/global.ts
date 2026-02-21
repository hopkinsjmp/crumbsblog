import type { Collection } from "tinacms";
import { ColorPickerInput } from "../fields/color";
import { iconSchema } from "../fields/icon";

const Global: Collection = {
  label: "Global",
  name: "global",
  path: "content/global",
  format: "json",
  ui: {
    global: true,
  },
  fields: [
    {
      type: "object",
      label: "Header",
      name: "header",
      fields: [
        iconSchema as any,
        {
          type: "string",
          label: "Name",
          name: "name",
        },
        {
          type: "string",
          label: "Color",
          name: "color",
          options: [
            { label: "Default", value: "default" },
            { label: "Primary", value: "primary" },
          ],
        },
        {
          type: "object",
          label: "Nav Links",
          name: "nav",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.label };
            },
            defaultItem: {
              href: "home",
              label: "Home",
            },
          },
          fields: [
            {
              type: "string",
              label: "Link",
              name: "href",
            },
            {
              type: "string",
              label: "Label",
              name: "label",
            },
          ],
        },
      ],
    },
    {
      type: "object",
      label: "Footer",
      name: "footer",
      fields: [
        {
          type: "object",
          label: "Social Links",
          name: "social",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.icon?.name || 'undefined' };
            },
          },
          fields: [
            iconSchema as any,
            {
              type: "string",
              label: "Url",
              name: "url",
            },
          ],
        },
      ],
    },
    {
      type: "object",
      label: "Theme",
      name: "theme",
      // @ts-ignore
      fields: [
        // ── Existing fields (kept for backward compat) ─────────────────────
        {
          type: "string",
          label: "Primary Color (legacy)",
          name: "color",
          ui: {
            component: ColorPickerInput,
          },
        },
        {
          type: "string",
          name: "font",
          label: "Body Font Family",
          options: [
            { label: "System Sans", value: "sans" },
            { label: "Nunito", value: "nunito" },
            { label: "Lato", value: "lato" },
          ],
        },
        {
          type: "string",
          name: "darkMode",
          label: "Dark Mode",
          options: [
            { label: "System", value: "system" },
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ],
        },
        // ── Brand color pickers ─────────────────────────────────────────────
        {
          type: "string",
          label: "Primary / Link Color",
          name: "primaryColor",
          description: "Main accent color used for links, buttons, and highlights. Default: #2a5db0",
          ui: {
            component: ColorPickerInput,
          },
        },
        {
          type: "string",
          label: "Accent / Hover Color",
          name: "accentColor",
          description: "Lighter tint used for hover backgrounds. Default: #dce8f8",
          ui: {
            component: ColorPickerInput,
          },
        },
        // ── Heading font picker ─────────────────────────────────────────────
        {
          type: "string",
          name: "headingFont",
          label: "Heading Font",
          description: "Serif font used for post titles and headings.",
          options: [
            { label: "Playfair Display (elegant serif)", value: "playfair" },
            { label: "Georgia (classic serif)", value: "georgia" },
            { label: "System Serif", value: "serif" },
            { label: "System Sans (no serif)", value: "sans" },
          ],
        },
      ],
    },
  ],
};

export default Global;
