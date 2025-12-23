'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import styles from './failed.module.css'

function FailedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('sessionId')

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✗</div>
        <h1 className={styles.title}>Verification Failed</h1>
        <p className={styles.description}>
          We were unable to verify your identity. Please try again and make sure all documents are clear and valid.
        </p>
        {sessionId && (
          <p className={styles.sessionId}>Session ID: {sessionId}</p>
        )}
        <div className={styles.buttonGroup}>
          <button
            className={styles.retryButton}
            onClick={() => router.push('/verify')}
          >
            Try Again
          </button>
          <button
            className={styles.backButton}
            onClick={() => router.push('/')}
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  )
}

export default function FailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailedContent />
    </Suspense>
  )
}
