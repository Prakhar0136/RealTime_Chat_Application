import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// ✅ correct for single deploy
app.use(cors({ credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ serve frontend in production
if (ENV.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendDistPath));

  app.get("*", (_, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});
