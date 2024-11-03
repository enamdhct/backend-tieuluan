const {ImgProduct} = require("../models/model");

const imgProductController = {
    addImgProduct: async(req, res) => {
        try {
            const newImgProduct = new ImgProduct(req.body);
            const savedImgProduct = await newImgProduct.save();
            res.status(200).json(savedImgProduct);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllImgProduct: async(req, res) => {
        try {
            const allImgProduct = await ImgProduct.find();
            res.status(200).json(allImgProduct);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getImgProduct: async(req, res) => {
        try {
            const imgProduct = await ImgProduct.findById(req.params.id);
            res.status(200).json(imgProduct);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateImgProduct: async(req, res) => {
        try {
            const imgProduct = await ImgProduct.findById(req.params.id);
            await imgProduct.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteImgProduct: async (req, res) => {
        try {

            await ImgProduct.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = imgProductController;