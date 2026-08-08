/**
 * Vercel serverless entry.
 * Uses the compiled Express app (no Express Services framework).
 */
import app from "../backend/dist/vercel-entry.js";

export default app;
