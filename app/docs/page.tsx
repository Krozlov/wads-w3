"use client";

// app/docs/page.tsx
// Renders Swagger UI at /docs
//
// Setup (run once):
//   npm install swagger-ui-react
//   npm install --save-dev @types/swagger-ui-react

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "swagger-ui-react/swagger-ui.css";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  const [spec, setSpec] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load spec: ${res.status}`);
        return res.json();
      })
      .then((data) => setSpec(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          background: "#0f172a",
          borderBottom: "3px solid #4f46e5",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>
                WADS-W3 API
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                Next.js 14 · Firebase Auth · OpenAPI 3.0
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "REST API", bg: "#e0e7ff", color: "#4f46e5" },
              { label: "v1.0.0",  bg: "#dcfce7", color: "#16a34a" },
            ].map((b) => (
              <span
                key={b.label}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 99,
                  background: b.bg,
                  color: b.color,
                }}
              >
                {b.label}
              </span>
            ))}
            <a
              href="https://github.com/Krozlov/wads-w3"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 99,
                background: "#1e293b",
                color: "#94a3b8",
                textDecoration: "none",
              }}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "16px 20px",
              color: "#b91c1c",
              marginBottom: 16,
            }}
          >
            <strong>Error loading API spec:</strong> {error}
            <br />
            <span style={{ fontSize: 13 }}>
              Make sure <code>app/api/docs/route.ts</code> exists and the dev server is running.
            </span>
          </div>
        )}

        {!spec && !error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 300,
              color: "#64748b",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: "3px solid #e2e8f0",
                borderTopColor: "#4f46e5",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ margin: 0 }}>Loading API spec...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {spec && (
          <>
            <SwaggerUI
              spec={spec}
              deepLinking={true}
              displayRequestDuration={true}
              tryItOutEnabled={true}
              persistAuthorization={true}
              defaultModelsExpandDepth={2}
              defaultModelExpandDepth={2}
            />
            <style>{`
              /* hide default topbar */
              .swagger-ui .topbar { display: none !important; }

              /* info block */
              .swagger-ui .info { margin: 0 0 24px 0; }
              .swagger-ui .info .title { font-size: 26px !important; color: #0f172a !important; }
              .swagger-ui .info p, .swagger-ui .info li { font-size: 14px !important; color: #475569 !important; line-height: 1.6 !important; }

              /* operation blocks */
              .swagger-ui .opblock { border-radius: 8px !important; margin-bottom: 10px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important; border: 1px solid #e2e8f0 !important; }
              .swagger-ui .opblock.opblock-get    { border-left: 4px solid #2563eb !important; }
              .swagger-ui .opblock.opblock-post   { border-left: 4px solid #16a34a !important; }
              .swagger-ui .opblock.opblock-put    { border-left: 4px solid #ea580c !important; }
              .swagger-ui .opblock.opblock-delete { border-left: 4px solid #dc2626 !important; }
              .swagger-ui .opblock.opblock-get    .opblock-summary { background: #eff6ff !important; }
              .swagger-ui .opblock.opblock-post   .opblock-summary { background: #f0fdf4 !important; }
              .swagger-ui .opblock.opblock-put    .opblock-summary { background: #fff7ed !important; }
              .swagger-ui .opblock.opblock-delete .opblock-summary { background: #fef2f2 !important; }

              /* method badges */
              .swagger-ui .opblock-summary-method { border-radius: 5px !important; font-size: 11px !important; font-weight: 700 !important; min-width: 64px !important; }

              /* tags */
              .swagger-ui .opblock-tag { font-size: 18px !important; color: #0f172a !important; border-bottom: 2px solid #e2e8f0 !important; padding-bottom: 8px !important; margin-bottom: 12px !important; }

              /* buttons */
              .swagger-ui .btn.execute { background: #4f46e5 !important; border-color: #4f46e5 !important; border-radius: 6px !important; font-weight: 600 !important; }
              .swagger-ui .btn.execute:hover { background: #4338ca !important; }
              .swagger-ui .btn.authorize { border-color: #4f46e5 !important; color: #4f46e5 !important; border-radius: 6px !important; font-weight: 600 !important; }

              /* inputs */
              .swagger-ui input[type=text], .swagger-ui textarea, .swagger-ui select { border-radius: 6px !important; border: 1px solid #cbd5e1 !important; font-size: 13px !important; }
              .swagger-ui input[type=text]:focus, .swagger-ui textarea:focus { border-color: #4f46e5 !important; outline: none !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.1) !important; }

              /* server block */
              .swagger-ui .scheme-container { background: #f8fafc !important; border-radius: 8px !important; padding: 12px 16px !important; box-shadow: none !important; }

              /* models */
              .swagger-ui section.models { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
}