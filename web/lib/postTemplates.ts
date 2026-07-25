export interface PostTemplate {
  key: string;
  label: string;
  description: string;
  heading?: string;
  body: string;
  tags?: string[];
}

export const POST_TEMPLATES: PostTemplate[] = [
  {
    key: 'blank',
    label: 'Blank',
    description: 'Start from scratch',
    body: '',
  },
  {
    key: 'learning-note',
    label: 'Learning note',
    description: 'What I learned this week',
    heading: 'What I learned this week',
    body: `> [!note]\n> A short reflection on what clicked, what surprised me, and what I still don't get.\n\n## what clicked\n\n- \n\n## what surprised me\n\n- \n\n## still murky\n\n- `,
    tags: ['learning'],
  },
  {
    key: 'post-mortem',
    label: 'Post-mortem',
    description: 'Incident write-up',
    heading: 'Post-mortem: <one-line title>',
    body: `## tl;dr\n\n<one paragraph — what happened, blast radius, resolution>\n\n## timeline\n\n- **HH:MM UTC** — alert fires\n- **HH:MM UTC** — engineer paged\n- **HH:MM UTC** — root cause identified\n- **HH:MM UTC** — mitigation shipped\n\n## root cause\n\n<what actually broke>\n\n## impact\n\n- users affected: \n- revenue: \n- data loss: \n\n## what went well\n\n- \n\n## what didn't\n\n- \n\n## action items\n\n- [ ] `,
    tags: ['post-mortem', 'systems'],
  },
  {
    key: 'til',
    label: 'TIL',
    description: 'A short "today I learned"',
    heading: 'TIL: ',
    body: `> [!tip]\n> A quick note — usually one thing that surprised me today.\n\n<the thing>\n\n\`\`\`\n<code snippet or evidence>\n\`\`\`\n\n**Source:** \n`,
    tags: ['til'],
  },
  {
    key: 'deep-dive',
    label: 'Deep dive',
    description: 'Long-form technical exploration',
    heading: '',
    body: `## motivation\n\n<why this matters>\n\n## background\n\n<context the reader needs>\n\n## the meat\n\n### part 1\n\n<content>\n\n### part 2\n\n<content>\n\n## takeaways\n\n- \n\n## further reading\n\n- `,
  },
];
