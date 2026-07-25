import type { Plugin } from 'unified';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';
import { visit } from 'unist-util-visit';

const CALLOUT_RE = /^\[!(note|tip|warn|warning|danger|info)\]\s*(.*)/i;

type CalloutKind = 'note' | 'tip' | 'warn' | 'info' | 'danger';

function normalizeKind(raw: string): CalloutKind {
  const k = raw.toLowerCase();
  if (k === 'warning') return 'warn';
  if (k === 'note' || k === 'tip' || k === 'warn' || k === 'info' || k === 'danger') return k;
  return 'note';
}

interface NodeData {
  hName?: string;
  hProperties?: Record<string, unknown>;
}

export const remarkCallouts: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      const first = node.children[0];
      if (!first || first.type !== 'paragraph') return;
      const firstChild = (first as Paragraph).children[0];
      if (!firstChild || firstChild.type !== 'text') return;
      const textNode = firstChild as Text;
      const m = textNode.value.match(CALLOUT_RE);
      if (!m) return;
      const kind = normalizeKind(m[1]);
      const remainder = m[2].trim();
      textNode.value = remainder;
      if (!remainder) {
        (first as Paragraph).children.shift();
        if ((first as Paragraph).children.length === 0) {
          node.children.shift();
        }
      }
      const data: NodeData = (node.data ?? (node.data = {})) as NodeData;
      data.hName = 'div';
      data.hProperties = { className: ['callout', `callout-${kind}`], 'data-kind': kind };
    });
  };
};
