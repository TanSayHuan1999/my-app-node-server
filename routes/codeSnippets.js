import express from "express";
import { codeSnippetAdd, codeSnippetDelete, codeSnippetDetail, codeSnippetEdit, codeSnippetList, getTags } from "../controllers/codeSnippets.js";

const router = express.Router();

router.post("/list", codeSnippetList);
router.post("/add", codeSnippetAdd);
router.patch("/edit/:id", codeSnippetEdit);
router.get("/details/:id", codeSnippetDetail);
router.delete("/delete/:id", codeSnippetDelete);
router.get("/get-tags", getTags);

export default router;
