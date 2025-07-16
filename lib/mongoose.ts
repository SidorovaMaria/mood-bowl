import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
// This file defines an asynchronous function `dbConnect`
// that manages a cached connection to a MongoDB database using Mongoose.
// It ensures that only one connection is established
// and reused across the application, improving performance and avoiding multiple connections.
// If a connection already exists, it returns the cached connection;
// otherwise, it creates a new one and caches it for future use.
const dbConnect = async () => {
  if (cached.conn) {
    console.log("Using cached connection");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "mood-bowl",
      })
      .then((result) => {
        console.log("Connected to MongoDb");
        return result;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
