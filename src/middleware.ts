import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();

  // Add security headers
  const headers = response.headers;

  // Prevent XSS attacks
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');
  
  // Enable strict HTTPS
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Control browser features
  headers.set(
    'Permissions-Policy',
    'microphone=self, camera=(), geolocation=(), payment=()'
  );

  // Set CSP to prevent XSS and other injection attacks
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com;"
  );

  return response;
} 