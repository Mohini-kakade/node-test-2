const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Counter = require("./counterModel"); // Import the Counter model

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const seqNum = counter.seq.toString().padStart(3, "0");
    this.userId = `U${seqNum}`;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
