const {Cart} = require("../models/model");

const cartController = {
    addCart: async(req, res) => {
        try {
            const newCart = new Cart(req.body);
            const savedCart = await newCart.save();
            res.status(200).json(savedCart);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllCart: async(req, res) => {
        try {
            const allCart = await Cart.find();
            res.status(200).json(allCart);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getCart: async(req, res) => {
        try {
            const cart = await Cart.findById(req.params.id);
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getCartOfUser: async(req, res) => {
        // console.log(req.params.id)
        try {
            const allCart = await Cart.find({ userID: req.params.id }).exec()
            // const cart = allCart.filters(item => item.userID === req.params.id);
            res.status(200).json(allCart);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateCart: async(req, res) => {
        try {
            const cart = await Cart.findById(req.params.id);
            await cart.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteCart: async (req, res) => {
        try {

            await Cart.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = cartController;