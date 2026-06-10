import mongoose from "mongoose";
import { env } from "./env.js";

let mongoConnection: Promise<typeof mongoose> | undefined;

export async function connectMongo() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is not set. API will run without a database connection.");
    return;
  }

  if (mongoose.connection.readyState === 1) return;

  mongoConnection ??= mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 20000
  });

  await mongoConnection;
  console.log("MongoDB connected");
}
