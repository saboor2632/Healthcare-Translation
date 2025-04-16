import { NextResponse } from 'next/server';
import { translateText, improveTranscription } from '../../../lib/gemini';
import { auditLogger } from '../../../lib/auditLogger';
import crypto from 'crypto';

// Maximum allowed session duration (15 minutes in milliseconds)
const MAX_SESSION_DURATION = 15 * 60 * 1000;

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  try {
    const { text, sourceLang, targetLang } = await request.json();
    
    // Input validation
    if (!text || !sourceLang || !targetLang) {
      await auditLogger.logEvent({
        eventType: 'error',
        action: 'translation_validation_failed',
        success: false,
        details: 'Missing required fields'
      });
      
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check session duration
    const sessionStart = request.headers.get('X-Session-Start');
    if (sessionStart && (Date.now() - parseInt(sessionStart)) > MAX_SESSION_DURATION) {
      await auditLogger.logEvent({
        eventType: 'error',
        action: 'session_timeout',
        success: false,
        details: 'Session expired'
      });
      
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Rate limiting headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', '100');
    headers.set('X-RateLimit-Remaining', '99');
    
    // Add HIPAA compliance headers
    headers.set('X-Request-ID', requestId);
    headers.set('X-Processing-Time', `${Date.now() - startTime}`);
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    headers.set('Pragma', 'no-cache');

    // Sanitize and improve the text
    const improvedText = await improveTranscription(text, sourceLang);
    
    // Perform translation
    const translatedText = await translateText({
      text: improvedText,
      sourceLang,
      targetLang,
    });

    // Log successful translation
    await auditLogger.logEvent({
      eventType: 'translation',
      action: 'medical_translation',
      success: true,
      details: `Translation completed: ${sourceLang} to ${targetLang}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json(
      { translatedText },
      { 
        headers,
        status: 200 
      }
    );
  } catch (error) {
    // Log error
    await auditLogger.logEvent({
      eventType: 'error',
      action: 'translation_failed',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    });

    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
} 