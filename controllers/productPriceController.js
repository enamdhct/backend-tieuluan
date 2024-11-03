const {ProductPrice} = require("../models/model");

const productPriceController = {
    addProductPrice: async(req, res) => {
        try {
            const newProductPrice = new ProductPrice(req.body);
            const savedProductPrice = await newProductPrice.save();
            res.status(200).json(savedProductPrice);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchProductPrice: async (req, res)=> {
        try {
            const searchValue = req.body.text
            const filteredProductPrices = await ProductPrice.find({
                name: { $regex: new RegExp(searchValue, "i") } 
            });
            let count = filteredProductPrices.length  
            res.status(200).json({
                productPrices: filteredProductPrices,
                count: count
            })
        } catch (err){
            res.status(500).json(err);
        }

    },

    getAllProductPrice: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1;
            const skip = (page - 1) * ITEMS_PER_PAGE;
    
            const totalProductPrices = await ProductPrice.countDocuments();
            const totalPages = Math.ceil(totalProductPrices / ITEMS_PER_PAGE);
    
            const allProductPrice = await ProductPrice.find()
                .skip(skip)
                .limit(ITEMS_PER_PAGE);
    
            res.status(200).json({
                productPrices: allProductPrice,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    getProductPrice: async(req, res) => {
        try {
            const productPrice = await ProductPrice.findById(req.params.id);
            res.status(200).json(productPrice);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateProductPrice: async(req, res) => {
        try {
            const productPrice = await ProductPrice.findById(req.params.id);
            await productPrice.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteProductPrice: async (req, res) => {
        try {

            await ProductPrice.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = productPriceController;