# Veriff KYC Verification - Next.js App

A Next.js application with Veriff KYC (Know Your Customer) verification integration.

## Features

- ✅ Identity verification using Veriff API (server-side session creation)
- ✅ Modern UI with responsive design
- ✅ Secure session creation via API routes
- ✅ Automatic redirect to Veriff verification flow
- ✅ Webhook handling for verification status updates
- ✅ Success and failure page handling
- ✅ TypeScript support

## Prerequisites

- Node.js 18+ installed
- Veriff account with API credentials
- npm or yarn package manager

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Veriff API credentials:

```env
VERIFF_API_KEY=your_veriff_api_key_here
VERIFF_BASE_URL=https://stationapi.veriff.com
# For local development, you can omit VERIFF_CALLBACK_URL (webhooks require HTTPS)
# For production, set this to your HTTPS webhook URL:
# VERIFF_CALLBACK_URL=https://yourdomain.com/api/veriff/webhook
```

**To get your Veriff API key:**
1. Sign up at [Veriff](https://www.veriff.com/)
2. Go to the [Veriff Customer Portal](https://station.veriff.com/)
3. Navigate to Settings → API Keys
4. Copy your API key

**Note on Local Development:**
- Veriff requires HTTPS URLs for webhooks/callbacks
- For local development, the callback is automatically omitted when using HTTP (localhost)
- To test webhooks locally, use a tool like [ngrok](https://ngrok.com/) to create an HTTPS tunnel
- Or simply test webhooks in production/staging environment

### 3. Configure Webhook URL (Production)

In production, make sure to:
1. Update `VERIFF_CALLBACK_URL` in your environment variables with your production domain
2. Configure the webhook URL in your Veriff dashboard: Settings → Webhooks
3. Add the webhook URL: `https://yourdomain.com/api/veriff/webhook`

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── veriff/
│   │       ├── session/      # API route to create verification sessions
│   │       └── webhook/      # Webhook endpoint for verification updates
│   ├── verify/               # Verification page
│   ├── success/              # Success page after verification
│   ├── failed/               # Failed verification page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## How It Works

The app uses **redirect mode** with automatic return to your app:

1. **User clicks "Start Verification"** on the home page
2. **Session Creation**: The app calls `/api/veriff/session` to create a Veriff session server-side with a `redirectUrl` parameter
3. **Redirect to Veriff**: User is redirected to Veriff's verification page
4. **User completes verification** on Veriff's page
5. **Return to App**: After verification, Veriff automatically redirects the user back to your app at `/success?sessionId=...`
6. **Webhook Updates**: Veriff also sends status updates to `/api/veriff/webhook` (requires HTTPS)

**Note**: Veriff requires HTTPS URLs for `redirectUrl` in production. For local development with HTTP, you may need to use a tool like [ngrok](https://ngrok.com/) to create an HTTPS tunnel, or test in a staging/production environment with HTTPS.

## API Routes

### POST `/api/veriff/session`

Creates a new Veriff verification session.

**Response:**
```json
{
  "sessionUrl": "https://station.veriff.com/...",
  "sessionId": "session_123",
  "status": "created"
}
```

### POST `/api/veriff/webhook`

Receives verification status updates from Veriff. Configure this URL in your Veriff dashboard.

## Customization

### Modify Verification Options

Edit `app/api/veriff/session/route.ts` to customize:
- Document types (PASSPORT, ID_CARD, DRIVERS_LICENSE, etc.)
- Supported countries
- Language preferences
- Additional verification parameters

### Styling

- Global styles: `app/globals.css`
- Component styles: Each page has its own `.module.css` file

## Security Considerations

1. **API Keys**: Never commit `.env.local` to version control
2. **Webhook Signatures**: In production, verify webhook signatures from Veriff
3. **HTTPS**: Always use HTTPS in production
4. **Server-side Session Creation**: Keep session creation server-side (already implemented)

## Documentation

- [Veriff Developer Docs](https://developers.veriff.com/)
- [Veriff JavaScript SDK](https://developers.veriff.com/#veriff-javascript-sdk)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT

## Support

For Veriff-specific issues, consult the [Veriff Support Documentation](https://developers.veriff.com/) or contact Veriff support.
