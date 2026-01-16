import aj from "../lib/arcjet.js";
import { ENV } from "../lib/env.js";
import { isSpoofedBot } from "@arcjet/inspect";

/**
 * Arcjet middleware (FINAL, CORRECT)
 * IMPORTANT:
 * - This middleware is mounted at /api
 * - So req.path does NOT include /api
 */
export const arcjetProtection = async (req, res, next) => {
  // Disable Arcjet outside production
  if (ENV.NODE_ENV !== "production") {
    return next();
  }

  /**
   * 🔥 CRITICAL FIX
   * When mounted as app.use("/api", arcjetProtection),
   * req.path will be:
   *   /auth/login
   *   /auth/signup
   *   /auth/check
   */
  if (req.path.startsWith("/auth")) {
    return next();
  }

  try {
    const decision = await aj.protect(req);

    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded" });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Access denied" });
      }

      return res
        .status(403)
        .json({ message: "Access denied by security policy" });
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        message: "Malicious bot activity detected",
        error: "Spoofed bot detected",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet protection error:", error);
    // Fail-open to avoid killing the app
    next();
  }
};
