import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import aiFixRoutes from "./routes/aiFix.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect DB
connectDB(process.env.MONGO_URI);

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// rate limiter 
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 60,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiFixRoutes);

// basic route
app.get("/", (req, res) => {
  res.send({ message: "Smart Task Evaluator API is running" });
});


// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
