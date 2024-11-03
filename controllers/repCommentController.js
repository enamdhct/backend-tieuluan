const {RepComment} = require("../models/model");

const repCommentController = {
    addRepComment: async(req, res) => {
        try {
            const newRepComment = new RepComment(req.body);
            const savedRepComment = await newRepComment.save();
            res.status(200).json(savedRepComment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllRepComment: async(req, res) => {
        try {
            const allRepComment = await RepComment.find();
            res.status(200).json(allRepComment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getRepComment: async(req, res) => {
        try {
            const repComment = await RepComment.findById(req.params.id);
            res.status(200).json(repComment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateRepComment: async(req, res) => {
        try {
            const repComment = await RepComment.findById(req.params.id);
            await repComment.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteRepComment: async (req, res) => {
        try {
            await RepComment.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = repCommentController;