import mongoose from "mongoose";

console.log(process.env.MONGODB_URI);

function connectDB() {
 mongoose.connect(process.env.MONGODB_URI)
 .then(() => {
  console.log("MongoDB connected successfully");
 })
 .catch((err) => {
  console.error("MongoDB connection error:", err);
 });
}

export default connectDB;