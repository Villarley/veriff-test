'use client'

import { useEffect, useState } from 'react'
import styles from './webhooks-test.module.css'

interface WebhookEvent {
  id: string
  timestamp: string
  type: string
  data: any
  status?: string
  verificationId?: string
}

export default function WebhooksTestPage() {
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEvent | null>(null)

  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/veriff/webhooks')
      if (response.ok) {
        const data = await response.json()
        setWebhooks(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching webhooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearWebhooks = async () => {
    try {
      const response = await fetch('/api/veriff/webhooks', {
        method: 'DELETE',
      })
      if (response.ok) {
        setWebhooks([])
        setSelectedWebhook(null)
        alert('Webhooks cleared!')
      }
    } catch (error) {
      console.error('Error clearing webhooks:', error)
    }
  }

  useEffect(() => {
    fetchWebhooks()
    // Refresh every 5 seconds to see new webhooks
    const interval = setInterval(fetchWebhooks, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'long',
    })
  }

  const getStatusEmoji = (status?: string) => {
    switch (status) {
      case 'success':
      case 'approved':
        return '✅'
      case 'declined':
        return '❌'
      case 'failed':
        return '⚠️'
      default:
        return '📄'
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>🔔 Webhooks Test</h1>
          <p className={styles.description}>
            Webhooks recibidos del servidor (guardados en memoria)
          </p>
          <div className={styles.actions}>
            <button onClick={fetchWebhooks} className={styles.refreshButton}>
              🔄 Refresh
            </button>
            <button onClick={clearWebhooks} className={styles.clearButton}>
              🗑️ Clear All
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading webhooks...</div>
        ) : webhooks.length === 0 ? (
          <div className={styles.empty}>
            <p>📭 No hay webhooks aún</p>
            <p className={styles.hint}>
              Los webhooks se guardarán aquí cuando Veriff los envíe a{' '}
              <code>/api/veriff/webhook</code>
            </p>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.stats}>
              <strong>{webhooks.length}</strong> webhook(s) recibido(s)
            </div>

            <div className={styles.list}>
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className={`${styles.webhookItem} ${
                    selectedWebhook?.id === webhook.id ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedWebhook(webhook)}
                >
                  <div className={styles.webhookHeader}>
                    <span className={styles.emoji}>
                      {getStatusEmoji(webhook.status)}
                    </span>
                    <div className={styles.webhookInfo}>
                      <strong>{webhook.type}</strong>
                      {webhook.status && (
                        <span className={styles.status}>{webhook.status}</span>
                      )}
                      <span className={styles.time}>
                        {formatDate(webhook.timestamp)}
                      </span>
                    </div>
                  </div>
                  {webhook.verificationId && (
                    <div className={styles.verificationId}>
                      ID: {webhook.verificationId}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedWebhook && (
              <div className={styles.details}>
                <h3>📋 Detalles del Webhook</h3>
                <button
                  className={styles.closeButton}
                  onClick={() => setSelectedWebhook(null)}
                >
                  ✕
                </button>
                <pre className={styles.json}>
                  {JSON.stringify(selectedWebhook.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

