import 'express-async-errors'; // must be first
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import courierRoutes from "./routes/courier.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";

import errorHandler from "./middlewares/error.middleware.js";
import logger from "./config/logger.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// basic rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/couriers", courierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// Error handler (last)
app.use(errorHandler);
