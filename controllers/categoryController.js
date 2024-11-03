const {Category} = require("../models/model");

const categoryController = {
    addCategory: async(req, res) => {
        try {
            console.log(req.body);
            const newCategory = new Category(req.body);
            const savedCategory = await newCategory.save();
            res.status(200).json(savedCategory);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllCategory: async(req, res) => {
        try {
            const allCategory = await Category.find();
            res.status(200).json(allCategory);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAll: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1; 
            const skip = (page - 1) * ITEMS_PER_PAGE;
    
            const totalCategorys = await Category.countDocuments();
            const totalPages = Math.ceil(totalCategorys / ITEMS_PER_PAGE);
    
            const allCategory = await Category.find({ name: { $ne: 'Tất cả' } })
                .skip(skip)
                .limit(ITEMS_PER_PAGE);
    
            res.status(200).json({
                categorys: allCategory,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getCategory: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            res.status(200).json(category);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateCategory: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            await category.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteCategory: async (req, res) => {
        try {

            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = categoryController;