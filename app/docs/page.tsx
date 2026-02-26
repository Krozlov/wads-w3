"use client";

// app/docs/page.tsx
// Renders the interactive Swagger UI at /docs
// Install deps: npm install next-swagger-doc swagger-ui-react
// npm install --save-dev @types/swagger-ui-react

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  const [spec, setSpec] = useState<object | null>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => setSpec(data));
  }, []);

  return (
    <div className="docs-wrapper">
      <div className="docs-header">
        <div className="docs-header-inner">
          <div className="docs-title-group">
            <span className="docs-flame">🔥</span>
            <div>
              <h1 className="docs-title">WADS-W3 API</h1>
              <p className="docs-subtitle">
                Next.js 14 · Firebase Auth · OpenAPI 3.0
              </p>
            </div>
          </div>
          <div className="docs-badges">
            <span className="badge badge-indigo">REST API</span>
            <span className="badge badge-green">v1.0.0</span>
            <a
              href="https://github.com/Krozlov/wads-w3"
              target="_blank"
              rel="noopener noreferrer"
              className="badge badge-dark"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      <div className="docs-body">
        {spec ? (
          <SwaggerUI
            spec={spec}
            deepLinking={true}
            displayRequestDuration={true}
            tryItOutEnabled={true}
            persistAuthorization={true}
            defaultModelsExpandDepth={2}
            defaultModelExpandDepth={2}
            syntaxHighlight={{ theme: "monokai" } as any}
          />
        ) : (
          <div className="docs-loading">
            <div className="docs-spinner" />
            <p>Loading API spec...</p>
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }

        .docs-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ── Header ── */
        .docs-header {
          background: #0f172a;
          border-bottom: 3px solid #4f46e5;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .docs-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .docs-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .docs-flame { font-size: 24px; }
        .docs-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }
        .docs-subtitle {
          margin: 0;
          font-size: 11px;
          color: #94a3b8;
        }
        .docs-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 99px;
          text-decoration: none;
          cursor: default;
        }
        .badge-indigo { background: #e0e7ff; color: #4f46e5; }
        .badge-green  { background: #dcfce7; color: #16a34a; }
        .badge-dark   { background: #1e293b; color: #94a3b8; cursor: pointer; }
        .badge-dark:hover { color: #fff; }

        /* ── Body ── */
        .docs-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        /* ── Loading ── */
        .docs-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: #64748b;
          gap: 12px;
        }
        .docs-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Swagger UI overrides ── */
        .docs-body .swagger-ui .topbar { display: none !important; }

        .docs-body .swagger-ui .info {
          margin: 0 0 24px 0;
        }
        .docs-body .swagger-ui .info .title {
          font-size: 26px !important;
          font-family: 'DM Sans', system-ui, sans-serif !important;
          color: #0f172a !important;
        }
        .docs-body .swagger-ui .info p,
        .docs-body .swagger-ui .info li {
          font-size: 14px !important;
          color: #475569 !important;
          line-height: 1.6 !important;
        }

        /* operation blocks */
        .docs-body .swagger-ui .opblock {
          border-radius: 8px !important;
          margin-bottom: 10px !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
          border: 1px solid #e2e8f0 !important;
        }
        .docs-body .swagger-ui .opblock-summary {
          border-radius: 7px !important;
        }
        .docs-body .swagger-ui .opblock.opblock-get    { border-left: 4px solid #2563eb !important; }
        .docs-body .swagger-ui .opblock.opblock-post   { border-left: 4px solid #16a34a !important; }
        .docs-body .swagger-ui .opblock.opblock-put    { border-left: 4px solid #ea580c !important; }
        .docs-body .swagger-ui .opblock.opblock-delete { border-left: 4px solid #dc2626 !important; }

        .docs-body .swagger-ui .opblock.opblock-get    .opblock-summary { background: #eff6ff !important; }
        .docs-body .swagger-ui .opblock.opblock-post   .opblock-summary { background: #f0fdf4 !important; }
        .docs-body .swagger-ui .opblock.opblock-put    .opblock-summary { background: #fff7ed !important; }
        .docs-body .swagger-ui .opblock.opblock-delete .opblock-summary { background: #fef2f2 !important; }

        /* method badges */
        .docs-body .swagger-ui .opblock-summary-method {
          border-radius: 5px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          min-width: 64px !important;
        }

        /* tags */
        .docs-body .swagger-ui .opblock-tag {
          font-size: 18px !important;
          color: #0f172a !important;
          border-bottom: 2px solid #e2e8f0 !important;
          padding-bottom: 8px !important;
          margin-bottom: 12px !important;
          font-family: 'DM Sans', system-ui, sans-serif !important;
        }

        /* execute button */
        .docs-body .swagger-ui .btn.execute {
          background: #4f46e5 !important;
          border-color: #4f46e5 !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
        }
        .docs-body .swagger-ui .btn.execute:hover {
          background: #4338ca !important;
        }

        /* authorize button */
        .docs-body .swagger-ui .btn.authorize {
          border-color: #4f46e5 !important;
          color: #4f46e5 !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
        }

        /* models section */
        .docs-body .swagger-ui section.models {
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
        }
        .docs-body .swagger-ui section.models h4 {
          color: #0f172a !important;
          font-family: 'DM Sans', system-ui, sans-serif !important;
        }

        /* response codes */
        .docs-body .swagger-ui .response-col_status { font-weight: 700 !important; }
        .docs-body .swagger-ui table.responses-table .response:first-child .response-col_status { color: #16a34a !important; }

        /* inputs */
        .docs-body .swagger-ui input[type=text],
        .docs-body .swagger-ui textarea,
        .docs-body .swagger-ui select {
          border-radius: 6px !important;
          border: 1px solid #cbd5e1 !important;
          font-size: 13px !important;
        }
        .docs-body .swagger-ui input[type=text]:focus,
        .docs-body .swagger-ui textarea:focus {
          border-color: #4f46e5 !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.1) !important;
        }

        /* code blocks */
        .docs-body .swagger-ui .microlight {
          border-radius: 6px !important;
          font-size: 12px !important;
        }

        /* servers dropdown */
        .docs-body .swagger-ui .scheme-container {
          background: #f8fafc !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          margin-bottom: 16px !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}