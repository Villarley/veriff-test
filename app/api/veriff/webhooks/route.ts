import { NextResponse } from 'next/server'
import { getAllWebhookEvents, clearWebhookEvents } from '@/lib/webhook-storage'

/**
 * GET /api/veriff/webhooks
 * 
 * Endpoint para obtener todos los webhooks guardados (solo para testing)
 * En producción, esto debería estar protegido con autenticación
 */
export async function GET() {
  try {
    const events = getAllWebhookEvents()
    return NextResponse.json({
      count: events.length,
      events,
    })
  } catch (error) {
    console.error('Error getting webhooks:', error)
    return NextResponse.json(
      { error: 'Failed to get webhooks' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/veriff/webhooks
 * 
 * Limpia todos los webhooks guardados (solo para testing)
 */
export async function DELETE() {
  try {
    clearWebhookEvents()
    return NextResponse.json({ message: 'Webhooks cleared' })
  } catch (error) {
    console.error('Error clearing webhooks:', error)
    return NextResponse.json(
      { error: 'Failed to clear webhooks' },
      { status: 500 }
    )
  }
}

