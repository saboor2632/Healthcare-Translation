import crypto from 'crypto';

export interface AuditEvent {
  eventType: 'translation' | 'access' | 'error' | 'authentication';
  action: string;
  userHash?: string;
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  details: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  private logQueue: AuditEvent[] = [];

  private constructor() {
    // Initialize with automatic log flushing
    setInterval(() => this.flushLogs(), 5 * 60 * 1000); // Flush every 5 minutes
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  public async logEvent(event: Omit<AuditEvent, 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      ...event,
      timestamp: new Date(),
    };

    // Remove any PHI/PII from details before logging
    auditEvent.details = this.sanitizeDetails(auditEvent.details);

    // Add to queue
    this.logQueue.push(auditEvent);

    // If queue is getting large, flush immediately
    if (this.logQueue.length >= 100) {
      await this.flushLogs();
    }
  }

  private sanitizeDetails(details: string): string {
    // Remove potential PHI patterns (e.g., SSN, phone numbers, email addresses)
    return details
      .replace(/\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, '[REDACTED-SSN]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED-PHONE]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED-EMAIL]');
  }

  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) return;

    try {
      // In a production environment, send logs to secure storage
      // For example: AWS CloudWatch, Azure Monitor, or HIPAA-compliant logging service
      console.log('Flushing HIPAA audit logs:', {
        timestamp: new Date(),
        eventCount: this.logQueue.length,
        events: this.logQueue.map(event => ({
          ...event,
          details: '[ENCRYPTED]' // Only log encrypted/redacted data
        }))
      });

      // Clear the queue after successful flush
      this.logQueue = [];
    } catch (error) {
      console.error('Failed to flush audit logs:', error);
      // In production, implement retry mechanism and alert administrators
    }
  }
}

export const auditLogger = AuditLogger.getInstance();

// Example usage:
// await auditLogger.logEvent({
//   eventType: 'translation',
//   action: 'medical_translation',
//   userHash: hashUserId(userId),
//   success: true,
//   details: 'Medical translation performed'
// }); 