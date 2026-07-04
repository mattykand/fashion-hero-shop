import posthog from "posthog-js";

// Project token is a write-only publishable key (safe in client bundles);
// hardcoded so the Vercel deploy tracks without any env-var setup.
posthog.init("phc_DnEwszebdxypLY2x39ooQ4aF2DVMpyMqPfdj5QmKWuWu", {
  api_host: "https://eu.i.posthog.com",
  // 2025-05-24 defaults: history-based pageviews for SPA navigation,
  // autocapture on. No session recording, no error tracking (scope of the
  // AT1 test is basic tracking only).
  defaults: "2025-05-24",
  disable_session_recording: true,
});
