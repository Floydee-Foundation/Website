import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";
import { inquiriesRouter } from "./routes/inquiries.js";

export const app = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());
app.use(healthRouter);
app.use(inquiriesRouter);
