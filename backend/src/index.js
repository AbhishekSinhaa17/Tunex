import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import https from "https";

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT;

const httpServer = createServer(app);

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
app.use(clerkMiddleware());

// Health check — responds instantly, no DB needed
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ── Lazy-loaded middleware & routes ──────────────────────────────────
// These are loaded on first request instead of at startup, shaving
// seconds off the cold-start time.

let initialized = false;

async function lazyInit(req, res, next) {
  if (initialized) return next();
  initialized = true;

  const startTime = Date.now();

  // Dynamic imports — only loaded when first request arrives
  const [
    { default: fileUpload },
    { default: cron },
    { default: fs },
    { connectDB },
    { initializeSocket },
    { default: userRoutes },
    { default: adminRoutes },
    { default: authRoutes },
    { default: songsRoutes },
    { default: albumRoutes },
    { default: statRoutes },
    { default: homeRoutes },
  ] = await Promise.all([
    import("express-fileupload"),
    import("node-cron"),
    import("fs"),
    import("./lib/db.js"),
    import("./lib/socket.js"),
    import("./routes/user.route.js"),
    import("./routes/admin.route.js"),
    import("./routes/auth.route.js"),
    import("./routes/song.route.js"),
    import("./routes/album.route.js"),
    import("./routes/stat.route.js"),
    import("./routes/home.route.js"),
  ]);

  // File upload middleware
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: path.join(__dirname, "tmp"),
      createParentPath: true,
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  );

  // Mount routes
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/songs", songsRoutes);
  app.use("/api/albums", albumRoutes);
  app.use("/api/stats", statRoutes);
  app.use("/api/home", homeRoutes);

  // Serve frontend in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/*splat", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
  }

  // Connect DB + Socket.io in parallel
  await Promise.all([
    connectDB(),
    Promise.resolve(initializeSocket(httpServer)),
  ]);

  // Temp file cleanup cron (every hour)
  const tempDir = path.join(process.cwd(), "tmp");
  cron.schedule("0 * * * *", () => {
    if (fs.existsSync(tempDir)) {
      fs.readdir(tempDir, (err, files) => {
        if (err) return;
        for (const file of files) {
          fs.unlink(path.join(tempDir, file), () => {});
        }
      });
    }
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

  console.log(`Lazy init completed in ${Date.now() - startTime}ms`);
  next();
}

// Apply lazy initializer to all API routes (except /api/health)
app.use("/api", lazyInit);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// Start server IMMEDIATELY — don't wait for DB
httpServer.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
