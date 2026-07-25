import type { Plugin } from 'unified';
import type { Root, Text, Link } from 'mdast';
import { visit } from 'unist-util-visit';

const WIKI_RE = /\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g;

export const remarkWikilinks: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined) return;
      const value = node.value;
      if (!value.includes('[[')) return;
      const parts: (Text | Link)[] = [];
      let last = 0;
      let m: RegExpExecArray | null;
      const re = new RegExp(WIKI_RE);
      while ((m = re.exec(value))) {
        if (m.index > last) {
          parts.push({ type: 'text', value: value.slice(last, m.index) });
        }
        const slug = m[1].trim();
        const label = (m[2] ?? slug).trim();
        parts.push({
          type: 'link',
          url: `/blog/${slug}`,
          title: null,
          data: { hProperties: { className: ['wikilink'] } },
          children: [{ type: 'text', value: label }],
        });
        last = m.index + m[0].length;
      }
      if (parts.length === 0) return;
      if (last < value.length) {
        parts.push({ type: 'text', value: value.slice(last) });
      }
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
};
