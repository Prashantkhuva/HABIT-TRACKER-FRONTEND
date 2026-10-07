import "server-only";
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = "habittraker";

export async function connectDB() {
  if (!global._mongooseConn) {
    global._mongooseConn = mongoose.connect(`${MONGODB_URL}/${DB_NAME}`, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).catch((err) => {
      global._mongooseConn = null;
      throw err;
    });
  }
  return global._mongooseConn;
}
