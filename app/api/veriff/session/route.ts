import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const VERIFF_API_KEY = process.env.VERIFF_API_KEY;
    const VERIFF_BASE_URL =
      process.env.VERIFF_BASE_URL || "https://stationapi.veriff.com";

    if (!VERIFF_API_KEY) {
      return NextResponse.json(
        { error: "VERIFF_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Get user data from request body (optional)
    const body = await request.json().catch(() => ({}));

    // Create a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Determine callback URL for webhooks (opcional)
    // Veriff requires HTTPS URLs, so skip callback in local development (HTTP)
    const callbackUrl =
      process.env.VERIFF_CALLBACK_URL ||
      (request.nextUrl.protocol === "https:"
        ? `${request.nextUrl.origin}/api/veriff/webhook`
        : undefined);

    // Prepare the verification request payload
    const verificationData: any = {
      verification: {
        person: {
          firstName: body.firstName || "",
          lastName: body.lastName || "",
        },
        document: {
          type: body.documentType || "PASSPORT",
          country: body.country || "US",
        },
        lang: body.lang || "en",
        // vendorData opcional para identificar al usuario
        vendorData: body.vendorData || body.userId || undefined,
      },
    };

    // Only include callback if it's HTTPS (required by Veriff)
    if (callbackUrl && callbackUrl.startsWith("https://")) {
      verificationData.verification.callback = callbackUrl;
    }

    // Create verification session using Veriff API
    const response = await fetch(`${VERIFF_BASE_URL}/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-CLIENT": VERIFF_API_KEY,
      },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Veriff API error:", errorText);
      return NextResponse.json(
        { error: "Failed to create verification session", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return session data to the client
    const verificationUrl = data.verification?.url || data.url;

    if (!verificationUrl) {
      return NextResponse.json(
        { error: "No verification URL returned from Veriff" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionUrl: verificationUrl,
      sessionId: data.verification?.id || sessionId,
      status: data.verification?.status || "created",
    });
  } catch (error) {
    console.error("Error creating Veriff session:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
