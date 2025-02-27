import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ensureZapRunning } from "./zapSetup.js";
import connectDB from "./config/db.js";

// Load environment variables first
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Then import and use routes
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

import scanRoutes from "./routes/scanRoutes.js";
app.use("/api/scan", scanRoutes);

const PORT = process.env.PORT || 5000;

// Start server with database and ZAP check
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Check if ZAP is running
    await ensureZapRunning();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`ZAP API available at http://localhost:8080`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    console.error("Make sure MongoDB and OWASP ZAP are running before starting the server");
    process.exit(1);
  }
}

startServer();
