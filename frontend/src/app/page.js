"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const scanWebsite = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    
    // Clear previous results and errors
    setScanResult(null);
    setError(null);
    setIsLoading(true);
    

    try {
      // Ensure URL has protocol
      const normalizedUrl = url.startsWith('http') ? url : `http://${url}`;
      
      const res = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        body: JSON.stringify({ url: normalizedUrl }),
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.details || "Scan failed");
      }
      
      setScanResult(data.scan);
    } catch (error) {
      console.error("Scan error:", error);
      setError(error.message || "Failed to complete scan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Website Vulnerability Scanner</h1>
      <div className="flex flex-col md:flex-row mt-4">
        <input
          type="text"
          className="border p-2 w-full md:w-auto"
          placeholder="Enter website URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          className={`bg-blue-500 text-white p-2 mt-2 md:mt-0 md:ml-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={scanWebsite}
          disabled={isLoading}
        >
          {isLoading ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-2 border border-red-500 bg-red-50 text-red-800">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 p-2 border">
          <h2 className="text-lg font-semibold">Scanning in progress...</h2>
          <p>This may take several minutes depending on the target website.</p>
        </div>
      )}

      {scanResult && (
        <div className="mt-4 p-2 border">
          <h2 className="text-lg font-semibold">Scan Report</h2>
          <pre className="overflow-x-auto bg-gray-50 p-2 mt-2">{JSON.stringify(scanResult.results, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
