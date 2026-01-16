import { ENV } from "./env.js";
import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

/**
 * Arcjet configuration
 * - Shield: LIVE (basic protection)
 * - Bot detection: DRY_RUN (do NOT block auth)
 * - Rate limit: LIVE but applied selectively
 */
const aj = arcjet({
  key: ENV.ARCJET_KEY,

  rules: [
    // Basic protection (safe)
    shield({ mode: "LIVE" }),

    // Bot detection (LOG ONLY, do not block)
    detectBot({
      mode: "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    // Rate limiting (handled in middleware selectively)
    slidingWindow({
      mode: "LIVE",
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj;
