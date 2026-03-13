const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    createSnippet,
    getSnippets,
    updateSnippet,
    deleteSnippet,
  } = require("../controllers/snippetController");

const router = express.Router();

router.post("/", protect, createSnippet);
router.get("/:roomId", protect, getSnippets);
router.put("/:id", protect, updateSnippet);
router.delete("/:id", protect, deleteSnippet);

module.exports = router;