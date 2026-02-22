// trigger re-index

import { defineConfig } from "tinacms";
import nextConfig from '../next.config'

import Post from "./collection/post";
import Global from "./collection/global";
import Author from "./collection/author";
import Page from "./collection/page";
import Tag from "./collection/tag";

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch: "main",
  token: process.env.TINA_TOKEN!,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
      publicFolder: "public", 
      outputFolder: "admin", 
      basePath: "crumbsblog", // This is correct for hopkinsjmp.github.io/crumbsblog/
    },
  schema: {
    collections: [Page, Post, Author, Tag, Global],
  },
});

export default config;
