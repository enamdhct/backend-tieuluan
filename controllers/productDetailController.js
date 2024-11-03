const {ProductDetail} = require("../models/model");

const productDetailController = {
    addProductDetail: async(req, res) => {
        try {
            const newProductDetail = new ProductDetail(req.body);
            const savedProductDetail = await newProductDetail.save();
            res.status(200).json(savedProductDetail);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchProductDetail: async (req, res)=> {
        try {
            const searchValue = req.body.text
            const filteredProductDetails = await ProductDetail.find({
                name: { $regex: new RegExp(searchValue, "i") } 
            });
            let count = filteredProductDetails.length  
            res.status(200).json({
                productDetails: filteredProductDetails,
                count: count
            })
        } catch (err){
            res.status(500).json(err);
        }

    },

    getAllProductDetail: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1;
            const skip = (page - 1) * ITEMS_PER_PAGE;
    
            const totalProductDetails = await ProductDetail.countDocuments();
            const totalPages = Math.ceil(totalProductDetails / ITEMS_PER_PAGE);
    
            const allProductDetail = await ProductDetail.find()
                .skip(skip)
                .limit(ITEMS_PER_PAGE);
    
            res.status(200).json({
                productDetails: allProductDetail,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    getProductDetail: async(req, res) => {
        try {
            const productDetail = await ProductDetail.findById(req.params.id);
            res.status(200).json(productDetail);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateProductDetail: async(req, res) => {
        try {
            const productDetail = await ProductDetail.findById(req.params.id);
            await productDetail.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteProductDetail: async (req, res) => {
        try {

            await ProductDetail.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = productDetailController;