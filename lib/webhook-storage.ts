/**
 * Simple in-memory storage for webhook events (for testing purposes only)
 * In production, you should use a database instead
 */

export interface WebhookEvent {
  id: string;
  timestamp: string;
  type: string;
  data: any;
  status?: string;
  verificationId?: string;
}

// In-memory storage (cleared on server restart)
const webhookStorage: WebhookEvent[] = [];

export function saveWebhookEvent(event: any): void {
  const webhookEvent: WebhookEvent = {
    id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    type: event.type || event.event || "unknown",
    data: event,
    status: event.verification?.status,
    verificationId: event.verification?.id,
  };

  webhookStorage.push(webhookEvent);

  // Keep only last 100 events to prevent memory issues
  if (webhookStorage.length > 100) {
    webhookStorage.shift();
  }

  console.log("📥 Webhook saved:", {
    id: webhookEvent.id,
    type: webhookEvent.type,
    status: webhookEvent.status,
    verificationId: webhookEvent.verificationId,
  });
}

export function getAllWebhookEvents(): WebhookEvent[] {
  return [...webhookStorage].reverse(); // Most recent first
}

export function getWebhookEventById(id: string): WebhookEvent | undefined {
  return webhookStorage.find((event) => event.id === id);
}

export function clearWebhookEvents(): void {
  webhookStorage.length = 0;
  console.log("🗑️ Webhook storage cleared");
}
