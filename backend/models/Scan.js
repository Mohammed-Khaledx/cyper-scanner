import mongoose from "mongoose";


const ScanSchema = new mongoose.Schema({
  url: String,
  // status: { type: String, default: "pending" },
  results: Object,
  scannedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Scan", ScanSchema);

