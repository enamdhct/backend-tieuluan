const {Comment, User, Product} = require("../models/model");

const commentController = {
    addComment: async(req, res) => {
        try {
            const newComment = new Comment(req.body);
            const savedComment = await newComment.save();
            res.status(200).json(savedComment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    repComment: async (req, res) => {
        const { content, userID, commentId } = req.body;
      
        try {
          // Tìm comment cần reply
          const parentComment = await Comment.findById(commentId);
          if (!parentComment) {
            return res.status(404).json({ error: 'Comment not found' });
          }
      
          // Thêm reply comment vào mảng replyComment
          parentComment.replyComment.push({ content, userID });
          await parentComment.save();
      
          res.status(201).json(parentComment);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    deleteReplyComment: async (req, res) => {
        const { commentId, replyId } = req.body;

        try {
          const parentComment = await Comment.findById(commentId);
          if (!parentComment) {
            return res.status(404).json({ error: 'Comment not found' });
          }
      
          if (!parentComment.replyComment) {
            return res.status(404).json({ error: 'Reply comments not found' });
          }
      
          const replyIndex = parentComment.replyComment.findIndex(
            (reply) => reply.id === replyId
          );
      
          if (replyIndex === -1) {
            return res.status(404).json({ error: 'Reply comment not found' });
          }
      
          parentComment.replyComment.splice(replyIndex, 1);
          await parentComment.save();
      
          res.status(200).json(parentComment);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getAllComment: async(req, res) => {
        try {
            const allComment = await Comment.find();
            res.status(200).json(allComment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getCommentWithProduct: async(req, res) => {
        try {
            let productID = req.params.id
            const allComment = await Comment.find();
            const filterComment = allComment.filter(comment => comment.productID === productID)
            res.status(200).json(filterComment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getComment: async(req, res) => {
        try {
            const comment = await Comment.findById(req.params.id);
            res.status(200).json(comment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateComment: async(req, res) => {
        try {
            const comment = await Comment.findById(req.params.id);
            await comment.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteComment: async (req, res) => {
        try {

            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllWithDetail: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;

            const skip = (page - 1) * limit;
            const comments = await Comment.find()
            .skip(skip)
            .limit(limit);
            const totalComments = await Comment.countDocuments();
            const totalPages = Math.ceil(totalComments / limit);
    
            const commentsWithDetails = await Promise.all(comments.map(async (comment) => {
                const user = await User.findById(comment.userID);
                const product = await Product.findById(comment.productID);
                const repliesWithDetails = await Promise.all(comment.replyComment.map(async (reply) => {
                    const replyUser = await User.findById(reply.userID);
    
                    return {
                        content: reply.content,
                        user: {
                            userID: reply.userID,
                            name: replyUser.name,
                            avatarURL: replyUser.avatarURL,
                        },
                        createdAt: reply.createdAt,
                        updatedAt: reply.updatedAt,
                    };
                }));
                return {
                    _id: comment._id,
                    content: comment.content,
                    user: {
                        userID: comment.userID,
                        name: user.name,
                        avatarURL: user.avatarURL,
                    },
                    product: {
                        productID: comment.productID,
                        name: product.name,
                        imgURL: product.imgURL,
                    },
                    replies: repliesWithDetails,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                };
            }));
    
            res.status(200).json({
                comments: commentsWithDetails,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getCommentDetail: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;

            const skip = (page - 1) * limit;
            const comments = await Comment.findById(req.body.commentID)
            .skip(skip)
            .limit(limit);
            const totalComments = comments.replyComment.length;
            const totalPages = Math.ceil(totalComments / limit);
    
            const repliesWithDetails = await Promise.all(comments.replyComment.map(async (reply) => {
                const replyUser = await User.findById(reply.userID);

                return {
                    _id: reply._id,
                    content: reply.content,
                    user: {
                        userID: reply.userID,
                        name: replyUser.name,
                        avatarURL: replyUser.avatarURL,
                    },
                    createdAt: reply.createdAt,
                    updatedAt: reply.updatedAt,
                };
            }));

    
    
            res.status(200).json({
                comments: repliesWithDetails,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getAllWithProduct: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const productIdFromBody = req.body.productId; // Lấy productId từ body
    
            const skip = (page - 1) * limit;
            const comments = await Comment.find({ productID: productIdFromBody })
                .skip(skip)
                .limit(limit);
            const totalComments = await Comment.countDocuments({ productID: productIdFromBody });
            const totalPages = Math.ceil(totalComments / limit);
    
            const commentsWithDetails = await Promise.all(comments.map(async (comment) => {
                const user = await User.findById(comment.userID);
                const product = await Product.findById(comment.productID);
                const repliesWithDetails = await Promise.all(comment.replyComment.map(async (reply) => {
                    const replyUser = await User.findById(reply.userID);
    
                    return {
                        content: reply.content,
                        user: {
                            userID: reply.userID,
                            name: replyUser.name,
                            avatarURL: replyUser.avatarURL,
                        },
                        createdAt: reply.createdAt,
                        updatedAt: reply.updatedAt,
                    };
                }));
                return {
                    _id: comment._id,
                    content: comment.content,
                    user: {
                        userID: comment.userID,
                        name: user.name,
                        avatarURL: user.avatarURL,
                    },
                    product: {
                        productID: comment.productID,
                        name: product.name,
                        imgURL: product.imgURL,
                    },
                    replies: repliesWithDetails,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                };
            }));
    
            res.status(200).json({
                comments: commentsWithDetails,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getTotalCommentsPerProduct: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const totalCommentsPerProduct = await Comment.aggregate([
                {
                    $group: {
                        _id: "$productID",
                        totalComments: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        productID: "$_id",
                        totalComments: 1,
                    },
                },
            ]);

            const allProducts = await Product.find({}, { _id: 1 });
    
            const totalCommentsMap = new Map(
                totalCommentsPerProduct.map((item) => [item.productID.toString(), item.totalComments])
            );
    
            allProducts.forEach((product) => {
                const productIdString = product._id.toString();
                if (!totalCommentsMap.has(productIdString)) {
                    totalCommentsPerProduct.push({
                        productID: productIdString,
                        totalComments: 0,
                    });
                }
            });
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedComments = totalCommentsPerProduct.slice(startIndex, endIndex);
    
            const totalPages = Math.ceil(totalCommentsPerProduct.length / limit);
    
            res.status(200).json({
                countCmt: paginatedComments,
                pagination: {
                    totalPages,
                    currentPage: page
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}
module.exports = commentController;