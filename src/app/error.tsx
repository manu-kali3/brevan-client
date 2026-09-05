"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="error-page">
      <div className="error-inner">
        <div className="error-code">500</div>
        <h1>Something Went Wrong</h1>
        <p>
          An unexpected error occurred while loading this page. Please try
          again, or contact us if the problem persists.
        </p>
        <div className="error-actions">
          <div className="green-button">
            <button type="button" onClick={() => reset()}>
              Try Again
            </button>
          </div>
          <div className="orange-button">
            <Link href="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
