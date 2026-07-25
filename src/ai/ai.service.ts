import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private client: Anthropic | null = null;

  constructor() {
    const key = process.env.ANTHROPIC_API_KEY;
    if (key) {
      this.client = new Anthropic({ apiKey: key });
    } else {
      this.logger.warn(
        'ANTHROPIC_API_KEY not set — /ai/* endpoints will return 501',
      );
    }
  }

  get enabled(): boolean {
    return this.client !== null;
  }

  async suggestTags(heading: string, body: string): Promise<string[]> {
    if (!this.client) return [];
    const excerpt = body.slice(0, 8000);
    const res = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system:
        'You suggest short, lowercase, hyphenated tags for a technical blog post. Return ONLY a JSON array of 3-6 tag strings. No prose, no code fences, no keys, just the JSON array. Examples: ["postgres","distributed-systems","concurrency"]. Prefer specific technical terms over generic ones.',
      messages: [
        {
          role: 'user',
          content: `Heading: ${heading}\n\nBody:\n${excerpt}\n\nReturn JSON tag array only.`,
        },
      ],
    });
    const textBlock = res.content.find((c) => c.type === 'text');
    if (!textBlock || textBlock.type !== 'text') return [];
    const raw = textBlock.text.trim();
    try {
      const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((t): t is string => typeof t === 'string')
          .map((t) =>
            t
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\- ]/g, '')
              .replace(/\s+/g, '-'),
          )
          .filter(Boolean)
          .slice(0, 6);
      }
    } catch {
      /* fall through */
    }
    return [];
  }
}
