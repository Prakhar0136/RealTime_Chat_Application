import aj from "../lib/arcjet.js";
import { ENV } from "../lib/env.js";
import { isSpoofedBot } from "@arcjet/inspect";

/**
 * Arcjet middleware
 * IMPORTANT:
 * - Arcjet is DISABLED for auth routes
 * - Prevents 403 on login/signup/check
 */
export const arcjetProtection = async (req, res, next) => {
  // Disable Arcjet in development
  if (ENV.NODE_ENV !== "production") {
    return next();
  }

  // 🔥 CRITICAL: Skip Arcjet for auth routes
  if (req.path.startsWith("/api/auth")) {
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

    // Extra spoofed bot protection
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        message: "Malicious bot activity detected",
        error: "Spoofed bot detected",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet protection error:", error);
    next(); // Fail open (do NOT block app)
  }
};
