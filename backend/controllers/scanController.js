import { startScan, getScanStatus, getScanResults } from "../services/zapService.js";
import Scan from "../models/Scan.js";

export const startSecurityScan = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const scanId = await startScan(url);

    let status = "0";
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes timeout
    
    while (status !== "100" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 sec
      status = await getScanStatus(scanId);
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      return res.status(408).json({ error: "Scan timeout - took too long to complete" });
    }

    const results = await getScanResults(url);
    const scan = await Scan.create({ url, results });

    res.json({ message: "Scan completed", scan });
  } catch (error) {
    console.error("Scan error:", error.message);
    res.status(500).json({ 
      error: "Failed to complete security scan", 
      details: error.message 
    });
  }
};
