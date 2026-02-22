import type { Collection } from 'tinacms';

const Info: Collection = {
  label: 'Info Pages',
  name: 'info',
  path: 'content/info',
  format: 'md',
  ui: {
    router: ({ document }) => {
      return `/${document._sys.filename}`;
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      isTitle: true,
      required: true,
    },
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
      isBody: true,
    },
  ],
};

export default Info;
