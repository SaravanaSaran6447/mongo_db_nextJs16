import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controller/notesContoller.js";

const router = express.Router();

router.use(protect); // Protect all routes in this router

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
