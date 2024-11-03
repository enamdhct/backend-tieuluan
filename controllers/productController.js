const {Product} = require("../models/model");

const productController = {
    addProduct: async(req, res) => {
        try {
            const newProduct = new Product(req.body);
            const savedProduct = await newProduct.save();
            res.status(200).json(savedProduct);
        } catch (err) {
            res.status(500).json(err);
        }
    },
     // Số bản ghi trên mỗi trang

    getProductWithCategory: async (req, res)=> {
        try {
            const category = req.body.categoryID
            const products = await Product.find()
            const filteredProducts = products.filter(product => product.categoryID === category);
            let count = filteredProducts.length  
            
            res.status(200).json({
                products: filteredProducts,
                count: count
            })
        } catch (err){
            res.status(500).json(err);
        }

    },
    getBestProduct: async (req, res)=> {
        try {
            const products = await Product.find()
            const filteredProducts = products.filter(product => product.isBestSaler === 'Có');
        
            res.status(200).json({
                products: filteredProducts,
            })
        } catch (err){
            res.status(500).json(err);
        }

    },
    searchProduct: async (req, res)=> {
        try {
            const searchValue = req.body.text
            const filteredProducts = await Product.find({
                name: { $regex: new RegExp(searchValue, "i") } 
            });
            let count = filteredProducts.length  
            res.status(200).json({
                products: filteredProducts,
                count: count
            })
        } catch (err){
            res.status(500).json(err);
        }

    },

    getAllProduct: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1; // Lấy số trang từ query params hoặc mặc định là 1
            const skip = (page - 1) * ITEMS_PER_PAGE;
    
            const totalProducts = await Product.countDocuments();
            const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    
            const allProduct = await Product.find()
                .skip(skip)
                .limit(ITEMS_PER_PAGE);
    
            res.status(200).json({
                products: allProduct,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAll: async (req, res) => {
        try {
            const allProduct = await Product.find()
            res.status(200).json(allProduct);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    getProduct: async(req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateProduct: async(req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            await product.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteProduct: async (req, res) => {
        try {

            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateStateProduct: async (req, res) => {
        const { categoryID, isActive } = req.body;
        try {
            const categoryExists = await Product.exists({ categoryID: categoryID });
            if (!categoryExists) {
                return res.status(404).json({ error: 'Category not found' });
            }
    
            await Product.updateMany({ categoryID: categoryID }, { $set: { isActive: isActive } });
    
            res.status(200).json({ success: true, message: 'Updated isActive for products with the specified categoryID' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}
module.exports = productController;