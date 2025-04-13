const mongoose = require("mongoose");
const Counter = require("./counterModel");

const postSchema = new mongoose.Schema(
  {
    post_id: { type: String, unique: true },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    content: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isUpdated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "postId" },
        { $inc: { seq: 1 } },
        { upsert: true, new: true }
      );

      const seqNum = counter.seq.toString().padStart(3, "0");
      this.post_id = `P${seqNum}`;

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Post", postSchema);
