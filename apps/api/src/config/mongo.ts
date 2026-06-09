import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectMongo() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is not set. API will run without a database connection.");
    return;
  }

  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
}
