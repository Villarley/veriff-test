import { NextRequest, NextResponse } from "next/server";
import { saveWebhookEvent } from "@/lib/webhook-storage";

/**
 * Veriff Webhook Handler
 *
 * This endpoint receives verification status updates from Veriff.
 * Make sure to configure this URL in your Veriff dashboard.
 *
 * For security, you should verify the webhook signature.
 * See: https://developers.veriff.com/#verifying-webhook-signatures
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📨 Veriff webhook received:", body);

    // Guardar el webhook para testear (en memoria del servidor)
    saveWebhookEvent(body);

    // Handle different event types
    const eventType = body.type || body.event;
    const verificationStatus = body.verification?.status;

    switch (eventType) {
      case "verification.success":
      case "verification.status.changed":
        // Handle successful verification
        if (
          verificationStatus === "success" ||
          verificationStatus === "approved"
        ) {
          // Update user status in your database
          // Example: await updateUserVerificationStatus(body.verification.id, 'verified')
          console.log("✅ Verification successful:", body.verification.id);
        } else if (verificationStatus === "declined") {
          // Handle declined verification
          console.log("❌ Verification declined:", body.verification.id);
        }
        break;

      case "verification.failed":
        // Handle failed verification
        console.log("⚠️ Verification failed:", body.verification?.id);
        break;

      default:
        console.log("ℹ️ Event type:", eventType, "Status:", verificationStatus);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true, saved: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    // Still return 200 to prevent Veriff from retrying
    return NextResponse.json(
      { error: "Webhook processing error", received: true },
      { status: 200 }
    );
  }
}

// Handle GET requests (for webhook URL verification)
export async function GET() {
  return NextResponse.json({
    message: "Veriff webhook endpoint is active",
    method: "POST",
  });
}
