const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    original_url: { type: String, required: true },
    short_code: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Url", urlSchema);
