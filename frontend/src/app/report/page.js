"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./report.css";

export default function Report() {
  const searchParams = useSearchParams();
  const scanData = searchParams.get("data") ? JSON.parse(decodeURIComponent(searchParams.get("data"))) : null;

  return (
    <main className="report-page">
      <header className="header">
        <Link href="/" className="logo">Scanner</Link>
        <nav className="navbar">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>

      <div className="report-content">
        <h1>Scan Report</h1>
        {scanData ? (
          <pre className="scan-output">{JSON.stringify(scanData, null, 2)}</pre>
        ) : (
          <p>No scan data available.</p>
        )}
        <Link href="/" className="contact-button">Back to Home</Link>
      </div>
    </main>
  );
}
