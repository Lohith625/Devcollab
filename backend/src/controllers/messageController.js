const Message = require("../models/Message");

const getMessages = async (req, res) => {

  try {

    const roomId = req.params.roomId;

    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

module.exports = { getMessages };