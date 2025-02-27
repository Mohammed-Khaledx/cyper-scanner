import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Allow configuring ZAP API URL through environment variables
const ZAP_API_URL = process.env.ZAP_API_URL || "http://localhost:8080";

export const startScan = async (url) => {
  try {
    console.log(`Starting ZAP scan for URL: ${url}`);
    
    // First, check if ZAP API is accessible
    await checkZapConnection();
    
    // Configure spider and active scan for the target
    console.log("Configuring spider for target...");
    await axios.get(`${ZAP_API_URL}/JSON/spider/action/scan/`, {
      params: { url, maxChildren: "10", recurse: "true" },
      timeout: 10000
    });
    
    // Wait briefly for spider to initialize
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("Starting active scan...");
    const res = await axios.get(`${ZAP_API_URL}/JSON/ascan/action/scan/`, {
      params: { url, recurse: "true" },
      timeout: 10000
    });
    
    console.log("ZAP scan response:", res.data);
    if (!res.data || !res.data.scan) {
      throw new Error("Invalid response from ZAP API");
    }
    
    return res.data.scan;
  } catch (error) {
    console.error("ZAP API error:", error.message);
    if (error.response) {
      console.error("ZAP response details:", JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error("No response from ZAP API - is ZAP running?");
    }
    throw new Error("Failed to start scan - check if ZAP is running");
  }
};

// Helper function to check ZAP connection
async function checkZapConnection() {
  try {
    const res = await axios.get(`${ZAP_API_URL}/JSON/core/view/version/`, {
      timeout: 5000
    });
    console.log(`Connected to ZAP API v${res.data.version}`);
    return res.data;
  } catch (error) {
    console.error("Unable to connect to ZAP API:", error.message);
    throw new Error("Cannot connect to ZAP API - make sure ZAP is running with API enabled");
  }
}

export const getScanStatus = async (scanId) => {
  try {
    const res = await axios.get(`${ZAP_API_URL}/JSON/ascan/view/status/`, {
      params: { scanId },
      timeout: 5000
    });
    console.log(`Scan status: ${res.data.status}%`);
    return res.data.status;
  } catch (error) {
    console.error("Failed to get scan status:", error.message);
    throw new Error("Failed to get scan status - ZAP API may be unavailable");
  }
};

export const getScanResults = async (url) => {
  try {
    console.log(`Getting scan results for ${url}`);
    const res = await axios.get(`${ZAP_API_URL}/JSON/core/view/alerts/`, {
      params: { baseurl: url },
      timeout: 30000
    });
    console.log(`Found ${res.data.alerts.length} alerts`);
    return res.data.alerts;
  } catch (error) {
    const errorMsg = error.response ? 
      `ZAP API error: ${error.response.status} ${error.response.statusText}` : 
      `ZAP API connection error: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
};
