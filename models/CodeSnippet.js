import mongoose from "mongoose";

export default mongoose.model(
  "CodeSnippet",
  mongoose.Schema({
    name: { type: String, required: true },
    purpose: { type: String, required: true },
    type: { type: String, required: true },
    language: { type: String, required: true },
    codes: { type: String, required: true },
    output: { type: String, required: true },
    source: { type: String, required: true },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
  })
);
