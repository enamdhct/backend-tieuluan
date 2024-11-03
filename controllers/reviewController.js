const {Review} = require("../models/model");

const reviewController = {
    addReview: async(req, res) => {
        try {
            const newReview = new Review(req.body);
            const savedReview = await newReview.save();
            console.log(savedReview);
            res.status(200).json(savedReview);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllReview: async(req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 8;
        
            const totalReviews = await Review.countDocuments();
            const totalPages = Math.ceil(totalReviews / pageSize);
        
            const reviews = await Review.find()
              .skip((page - 1) * pageSize)
              .limit(pageSize);
        
            res.status(200).json({
              reviews: reviews,
              pagination: {
                currentPage: page,
                totalPages: totalPages,
              },
            });
          } catch (err) {
            res.status(500).json(err);
          }
    },
    getReview: async(req, res) => {
        try {
            const review = await Review.findById(req.params.id);
            res.status(200).json(review);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getReviewOfUser: async(req, res) => {
        try {
            const allReview = await Review.find({ userID: req.params.id }).exec()
            res.status(200).json(allReview);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateReview: async(req, res) => {
        try {
            const review = await Review.findById(req.params.id);
            await review.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteReview: async (req, res) => {
        try {

            await Review.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    searchReview: async (req, res) => {
        try {
          const searchValue = req.body.text;
      
          const page = parseInt(req.query.page) || 1;
          const pageSize = parseInt(req.query.pageSize) || 10;
      
          const totalReviews = await Review.countDocuments({
            $or: [
              { rate: searchValue },
              { 'user.name': { $regex: new RegExp(searchValue, "i") } },
            ],
          });
      
          const totalPages = Math.ceil(totalReviews / pageSize);
      
          const reviews = await Review.find({
            $or: [
              { rate: searchValue },
              { 'user.name': { $regex: new RegExp(searchValue, "i") } },
            ],
          })
          .skip((page - 1) * pageSize)
          .limit(pageSize);
      
          res.status(200).json({
            reviews: reviews,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
            },
          });
        } catch (err) {
          res.status(500).json(err);
        }
      }

}
module.exports = reviewController;