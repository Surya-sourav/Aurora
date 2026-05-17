import type { Options as PrettyOptions } from 'rehype-pretty-code';

export const rehypePrettyCodeOptions: PrettyOptions = {
  theme: {
    dark: 'github-dark-dimmed',
    light: 'github-light',
  },
  keepBackground: false,
  defaultLang: 'plaintext',
};
