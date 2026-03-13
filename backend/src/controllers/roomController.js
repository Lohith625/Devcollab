const Room = require("../models/Room");

// Create room
const createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Room name required" });
    }

    const room = await Room.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(room);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy", "username email");

    res.json(rooms);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Join room
const joinRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user already a member
    if (room.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    room.members.push(req.user._id);
    await room.save();

    res.json({ message: "Joined room successfully", room });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  joinRoom,
};