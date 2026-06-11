import mongoose from "mongoose";
import { env } from "./env.js";

let mongoConnection: Promise<typeof mongoose> | undefined;
const mongoConnectAttempts = 2;
const mongoRetryDelayMs = 250;

function startMongoConnection() {
  if (mongoose.connection.readyState === 0 && mongoConnection) mongoConnection = undefined;
  mongoConnection ??= mongoose.connect(env.mongoUri!, {
    connectTimeoutMS: 4000,
    maxPoolSize: 5,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 4000
  }).catch((error) => {
    mongoConnection = undefined;
    throw error;
  });

  return mongoConnection;
}

mongoose.connection.on("disconnected", () => {
  mongoConnection = undefined;
});

mongoose.connection.on("error", () => {
  if (mongoose.connection.readyState === 0) mongoConnection = undefined;
});

export async function connectMongo() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is not set. API will run without a database connection.");
    return;
  }

  if (mongoose.connection.readyState === 1) return;
  if (mongoose.connection.readyState === 0) mongoConnection = undefined;

  let lastError: unknown;

  for (let attempt = 1; attempt <= mongoConnectAttempts; attempt += 1) {
    try {
      await startMongoConnection();
      console.log("MongoDB connected");
      return;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection attempt ${attempt} failed`, error);
      if (attempt < mongoConnectAttempts) await new Promise((resolve) => setTimeout(resolve, mongoRetryDelayMs));
    }
  }

  throw lastError;
}
