import express from "express";
import { startSecurityScan } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", startSecurityScan);

export default router;
