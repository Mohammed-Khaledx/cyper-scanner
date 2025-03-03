"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./style.css";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const scanWebsite = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const normalizedUrl = url.startsWith("http") ? url : `http://${url}`;

      const res = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        body: JSON.stringify({ url: normalizedUrl }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Scan failed");
      }

      router.push(`/report?data=${encodeURIComponent(JSON.stringify(data.scan))}`);
    } catch (error) {
      console.error("Scan error:", error);
      setError(error.message || "Failed to complete scan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4">
      <header className="header">
        <Link href="/" className="logo">Scanner</Link>
        <nav className="navbar">
          <Link href="/" className="active">Home</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>

      <div className="home">
        <div className="background-image">
          <Image src="/m2.png" alt="Background" fill objectFit="cover" priority />
        </div>
        <div className="home-content">
          <h1>Web Vulnerability Scanner</h1>
          <h3>Welcome, User!</h3>
          <p>
            "We appreciate you using our platform 💙
            <br />
            Your website’s security is our priority!"
          </p>

          <div className="custom-search">
            <input
              type="text"
              className="custom-search-input"
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              className="custom-search-button"
              onClick={scanWebsite}
              disabled={isLoading}
            >
              {isLoading ? "Scanning..." : "Scan"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-2 border border-red-500 bg-red-50 text-red-800">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </main>
  );
}