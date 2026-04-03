import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);
console.log("Current environment:", process.env.NODE_ENV);
app.use(express.json());

app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
