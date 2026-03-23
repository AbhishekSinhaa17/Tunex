import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import cron from "node-cron";
import fs from "fs";
import https from "https";

import { initializeSocket } from "./lib/socket.js";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songsRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import homeRoutes from "./routes/home.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",   
  "https://tunex-rsmw.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware()); // this will add the req.auth object to the request, which contains the userId and other information about the authenticated user
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 50 MB maximum file size
  })
);

const tempDir = path.join(process.cwd(), "tmp");
//cron jobs can be added here
// delete those files that are older than 1 hour
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.error("Error reading temp directory:", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

// Health check endpoint for keep-alive pings
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songsRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/home", homeRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

//error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// Self-ping to prevent Render free-tier cold starts (every 14 minutes)
const RENDER_URL = "https://tunex.onrender.com";
cron.schedule("*/14 * * * *", () => {
  https
    .get(`${RENDER_URL}/api/health`, (res) => {
      console.log(`Keep-alive ping: ${res.statusCode}`);
    })
    .on("error", (err) => {
      console.error("Keep-alive ping failed:", err.message);
    });
});

// Connect to DB first, then start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
