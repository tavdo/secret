import "./types/express-augment.js";
import { createApp } from "./app.js";

/** Express app export for Vercel Services (no listen). */
const app = createApp();
export default app;
