import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import { arcjetProtection } from "./middleware/arcjet.middleware.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// ---------------- BASIC MIDDLEWARE ----------------
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors({ credentials: true }));

// ---------------- ARCJET (API ONLY) ----------------
// 🔥 DO NOT protect frontend or static files
app.use("/api", arcjetProtection);

// ---------------- API ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ---------------- FRONTEND (PRODUCTION) ----------------
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// ---------------- START SERVER ----------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
