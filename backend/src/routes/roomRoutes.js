const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createRoom, getRooms, joinRoom } = require("../controllers/roomController");

const router = express.Router();

router.post("/", protect, createRoom);
router.get("/", protect, getRooms);
router.post("/:id/join", protect, joinRoom);

module.exports = router;