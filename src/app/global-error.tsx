"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#fff",
            fontFamily: "Poppins, system-ui, sans-serif",
            boxSizing: "border-box",
            margin: 0,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#ff511a",
                margin: 0,
                letterSpacing: 4,
              }}
            >
              500
            </h1>
            <h2
              style={{
                color: "#212741",
                margin: "12px 0 8px",
                fontWeight: 700,
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: "#7a7a7a",
                maxWidth: 460,
                margin: "0 auto 28px",
                lineHeight: 1.7,
              }}
            >
              An unexpected error occurred. Please refresh the page or try
              again later.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "14px 32px",
                border: "none",
                borderRadius: 6,
                backgroundColor: "#43ba7f",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
