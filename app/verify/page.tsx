"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./verify.module.css";

function VerifyContent() {
  const router = useRouter();
  const mounted = useRef(false);
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const initVerification = async () => {
      try {
        // Crear sesión en el servidor
        const response = await fetch("/api/veriff/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Failed to create verification session"
          );
        }

        const data = await response.json();

        if (!data.sessionUrl) {
          throw new Error("Invalid response from server: missing session URL");
        }

        setSessionId(data.sessionId || "");

        // Importar y inicializar SDK de Veriff dinámicamente (solo en cliente)
        const initVeriff = async () => {
          try {
            const Veriff = (await import("@veriff/js-sdk")).default;

            const veriff = Veriff({
              apiKey: process.env.NEXT_PUBLIC_VERIFF_API_KEY || "",
              parentId: "veriff-root",
              onSession: function (err, response) {
                if (err) {
                  console.error("Error en sesión Veriff:", err);
                  setStatus("error");
                  setErrorMessage(
                    err.message || "Error al iniciar la verificación"
                  );
                  return;
                }

                // Redirigir a la URL de verificación
                const verificationUrl =
                  response?.verification?.url || data.sessionUrl;
                if (!verificationUrl) {
                  console.error("No verification URL");
                  setStatus("error");
                  setErrorMessage("No se pudo obtener la URL de verificación");
                  return;
                }

                // Redirigir a Veriff para completar la verificación
                window.location.href = verificationUrl;
              },
            });

            // Montar el componente de Veriff
            veriff.mount();
            setStatus("loading");
          } catch (sdkError) {
            console.error("Error loading Veriff SDK:", sdkError);
            // Fallback: redirigir directamente si el SDK falla
            window.location.href = data.sessionUrl;
          }
        };

        await initVeriff();
      } catch (error) {
        console.error("Error creating verification session:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to initialize verification. Please try again."
        );
      }
    };

    initVerification();
  }, [router]);

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verify Your Identity</h1>
        <p className={styles.description}>
          Please follow the instructions to complete your identity verification.
        </p>

        {status === "loading" && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading verification form...</p>
          </div>
        )}

        {/* Contenedor para el SDK de Veriff */}
        <div id="veriff-root" className={styles.veriffContainer} />

        {status === "error" && (
          <div className={styles.error}>
            <p className={styles.errorMessage}>{errorMessage}</p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button
              className={styles.backButton}
              onClick={() => router.push("/")}
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.container}>
          <div className={styles.card}>
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading...</p>
            </div>
          </div>
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
