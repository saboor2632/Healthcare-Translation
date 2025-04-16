import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

// Function to hash sensitive data
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Function to encrypt sensitive data
function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

export function hipaaMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  const headers = response.headers;

  // 1. Enforce TLS/SSL
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 2. Set secure cookie attributes
  headers.set('Set-Cookie', 'session=; HttpOnly; Secure; SameSite=Strict');

  // 3. Add HIPAA-specific security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-origin-when-cross-origin');

  // 4. Set strict CSP for healthcare data
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "connect-src 'self' https://generativelanguage.googleapis.com; " +
    "frame-ancestors 'none'; " +
    "form-action 'self';"
  );

  // 5. Add security headers for audit logging
  headers.set('X-Request-ID', crypto.randomUUID());
  headers.set('X-Transaction-ID', Date.now().toString());

  return response;
} 