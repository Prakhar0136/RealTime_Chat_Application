import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

// 🔹 Fix __dirname for ES modules (VERY IMPORTANT)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Render provides PORT automatically
const PORT = process.env.PORT || 3000;

// ---------------- MIDDLEWARE ----------------
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// ✅ Same-origin setup (frontend + backend together)
app.use(cors({ credentials: true }));

// ---------------- API ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ---------------- FRONTEND SERVING (PRODUCTION ONLY) ----------------
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");

  // Serve static assets
  app.use(express.static(frontendDistPath));

  // React SPA fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// ---------------- START SERVER ----------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
