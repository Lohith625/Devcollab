const Snippet = require("../models/Snippet");
const Room = require("../models/Room");

// Create snippet
const createSnippet = async (req, res) => {
  try {
    const { roomId, code, language } = req.body;

    if (!roomId || !code) {
      return res.status(400).json({ message: "Room and code required" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is member
    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: "Not a room member" });
    }

    const snippet = await Snippet.create({
      room: roomId,
      author: req.user._id,
      code,
      language,
    });

    res.status(201).json(snippet);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get snippets for room
const getSnippets = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const snippets = await Snippet.find({ room: roomId })
      .populate("author", "username email");

    res.json(snippets);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update snippet
const updateSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // Only author can edit
    if (snippet.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    snippet.code = req.body.code || snippet.code;
    snippet.language = req.body.language || snippet.language;

    const updatedSnippet = await snippet.save();

    res.json(updatedSnippet);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete snippet
const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // Only author can delete
    if (snippet.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await snippet.deleteOne();

    res.json({ message: "Snippet deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSnippet,
  getSnippets,
  updateSnippet,
  deleteSnippet,
};