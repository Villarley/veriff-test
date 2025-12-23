'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartVerification = async () => {
    setIsLoading(true)
    try {
      // Redirect to verification page
      router.push('/verify')
    } catch (error) {
      console.error('Error starting verification:', error)
      alert('Failed to start verification. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Identity Verification</h1>
        <p className={styles.description}>
          Complete your KYC verification to continue. This process is quick and secure.
        </p>
        <button
          className={styles.button}
          onClick={handleStartVerification}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Start Verification'}
        </button>
      </div>
    </main>
  )
}
