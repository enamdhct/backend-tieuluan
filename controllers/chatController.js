const {Chat} = require("../models/model");

const chatController = {
    addChat: async(req, res) => {
        try {
            const newChat = new Chat(req.body);
            const savedChat = await newChat.save();
            res.status(200).json(savedChat);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllChat: async(req, res) => {
        try {
            const allChat = await Chat.find();
            res.status(200).json(allChat);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getChat: async(req, res) => {
        try {
            const chat = await Chat.findById(req.params.id);
            res.status(200).json(chat);
        } catch (err) {
            res.status(500).json(err);
        }
    },

}
module.exports = chatController;