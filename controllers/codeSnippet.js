import mongoose from "mongoose";
import CodeSnippet from "../models/CodeSnippet.js";

// Code Snippet Listing
export const codeSnippetList = async (req, res) => {
  const r = req.body;
  console.log(r);
  try {
    const fieldsToSearch = ["name", "purpose", "type"].map((s) => ({ [s]: { $regex: r.search, $options: "i" } }));
    // const tags = (r.tags.trim() && r.tags.split(",")) || [];
    const tags = r?.tags?.length > 0 ? r.tags : [];

    let filter = {
      ...(r.type && { type: r.type }),
      ...(r.language && { language: r.language }),
      ...(r.search && { $or: fieldsToSearch }),
      ...(tags.length > 0 && { tags: { $in: tags } }),
    };

    const page = parseInt(r?.page) || 1;
    const limit = parseInt(r?.limit) || 3;
    const skip = page - 1 > 0 ? (page - 1) * limit : 0;
    const sort = r.sortBy ? { [r.sortBy]: r.sortDir === "desc" ? -1 : -1 } : { updatedAt: -1 };
    const list = await CodeSnippet.find(filter).sort(sort).skip(skip).limit(limit);
    const totalPages = Math.ceil((await CodeSnippet.countDocuments(filter)) / limit);

    res.status(200).json({ success: true, list, totalPages });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Add New Code Snippet
export const codeSnippetAdd = async (req, res) => {
  const r = req.body;
  const newCodeSnippet = new CodeSnippet({
    name: r.name,
    purpose: r.purpose,
    type: r.type,
    language: r.language,
    codes: r.codes_val,
    output: r.output_val,
    source: r.source,
    tags: r.tags_val?.split(","),
    isFeatured: r.isFeatured,
  });
  try {
    const codeSnippet = await newCodeSnippet.save();
    res.status(200).json({ success: true, codeSnippet });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Edit Code Snippet
export const codeSnippetEdit = async (req, res) => {
  const id = req.params.id;
  const r = req.body;
  try {
    const updatedValue = {
      name: r.name,
      purpose: r.purpose,
      type: r.type,
      language: r.language,
      codes: r.codes_val,
      output: r.output_val,
      tags: r.tags_val?.split(","),
      source: r.source,
      isFeatured: r.isFeatured,
      updatedAt: new Date().toISOString(),
    };
    const updatedCodeSnippet = await CodeSnippet.findByIdAndUpdate(id, updatedValue, { new: true });
    res.status(200).json({ success: true, updatedCodeSnippet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

// Get Code Snippet Detail
export const codeSnippetDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const codeSnippet = await CodeSnippet.findById(id);
    res.status(200).json({ success: true, codeSnippet });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Delete Code Snippet
export const codeSnippetDelete = async (req, res) => {
  const id = req.params.id;
  try {
    console.log(id);
    const codeSnippet = await CodeSnippet.findByIdAndDelete(id);
    if (!codeSnippet) res.status(404).json({ msg: "Code Snippet Not Found" });
    res.status(200).json({ success: true, codeSnippet });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await CodeSnippet.distinct("tags");
    if (tags) {
      res.status(200).json({ success: true, tags });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
