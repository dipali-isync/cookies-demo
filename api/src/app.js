import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import "./config/env.js";
import routeConfig from "./routes/RouteConfig.js";
import cookieParser from "cookie-parser";

const app = express();

// Connect DB
(async () => {
  await connectDB();
})();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5002", "http://192.168.1.211:5002"], // your frontend URL
    credentials: true, // allow cookies/auth headers
  }),
);

app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use(cookieParser());

app.get("/", (req, res) => res.send("API running"));
routeConfig(app);

export default app;
