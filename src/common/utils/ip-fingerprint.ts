import type { Request } from 'express';

export function ipFingerprint(req: Request): string {
  const xff = req.headers['x-forwarded-for'];
  const headerIp =
    typeof xff === 'string' ? xff.split(',')[0]?.trim() : undefined;
  return headerIp ?? req.socket?.remoteAddress ?? 'unknown';
}
