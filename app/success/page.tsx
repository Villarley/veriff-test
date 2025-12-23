"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import styles from "./success.module.css";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>Verification Successful!</h1>
        <p className={styles.description}>
          Your identity has been successfully verified. You can now continue
          using our services.
        </p>
        {sessionId && (
          <p className={styles.sessionId}>Session ID: {sessionId}</p>
        )}
        <button className={styles.button} onClick={() => router.push("/")}>
          Return to Home
        </button>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
