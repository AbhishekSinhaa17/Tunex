import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Optimized connection settings for faster cold starts
      serverSelectionTimeoutMS: 5000,   // Fail fast if server not found (default 30s)
      socketTimeoutMS: 45000,           // Close sockets after 45s inactivity
      maxPoolSize: 10,                  // Maintain up to 10 connections
      minPoolSize: 2,                   // Keep at least 2 connections ready
      maxIdleTimeMS: 60000,             // Close idle connections after 60s
      connectTimeoutMS: 10000,          // Connection attempt timeout (default 30s)
      heartbeatFrequencyMS: 10000,      // Check server health every 10s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
