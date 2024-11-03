const {Order, User, Comment, Product, Review, Warehouse } = require("../models/model");

const moment = require('moment');
const statisticalController = { 
    getStatistical: async (req, res) => {
        try {
            const orderStatistics = await Order.aggregate([
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },  
                  totalRevenue: { $sum: '$Price' },  
                },
              },
              {
                $project: {
                  _id: 0,  
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
        
            if (orderStatistics.length > 0) {
              res.status(200).json(orderStatistics[0]);
            } else {
              res.status(404).json({ message: 'Không có đơn hàng nào.' });
            }
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    },
    getStatisticalWithDay: async (req, res) => {
        try {
            const { date } = req.body;
        
            const selectedDate = new Date(date);
        
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
        
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);
        
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        
            const endOfWeek = new Date(selectedDate);
            endOfWeek.setHours(23, 59, 59, 999);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
        
            const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        
            const matchCondition = {
              orderTime: { $gte: startOfDay, $lte: endOfDay },
            };
        
            const orderStatistics = await Order.aggregate([
              {
                $match: matchCondition,
              },
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 }, 
                  totalRevenue: { $sum: '$Price' },  
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
        
            const orderStatisticsByWeek = await Order.aggregate([
              {
                $match: {
                  orderTime: { $gte: startOfWeek, $lte: endOfWeek },
                  state: "Hoàn thành"
                },
              },
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: { $sum: '$Price' },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
        
            const orderStatisticsByMonth = await Order.aggregate([
              {
                $match: {
                  orderTime: { $gte: startOfMonth, $lte: endOfMonth },
                  state: "Hoàn thành"
                },
              },
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: { $sum: '$Price' },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
        
            const orderStatisticsAll = await Order.aggregate([
                {
                    $match: {
                        state: "Hoàn thành"
                    },
                },
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: { $sum: '$Price' },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
            const customerStatistics = await User.aggregate([
                {
                  $match: {
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalCustomers: { $sum: 1 },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    totalCustomers: 1,
                  },
                },
              ]);
          
            const customerStatisticsByWeek = await User.aggregate([
            {
                $match: {
                createdAt: { $gte: startOfWeek, $lte: endOfWeek },
                },
            },
            {
                $group: {
                _id: null,
                totalCustomers: { $sum: 1 },
                },
            },
            {
                $project: {
                _id: 0,
                totalCustomers: 1,
                },
            },
            ]);
        
            const customerStatisticsByMonth = await User.aggregate([
            {
                $match: {
                createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                },
            },
            {
                $group: {
                _id: null,
                totalCustomers: { $sum: 1 },
                },
            },
            {
                $project: {
                _id: 0,
                totalCustomers: 1,
                },
            },
            ]);
        
            const customerStatisticsAll = await User.aggregate([
              {
                $match: {
                    role: "",
                },
              },
              {
                  $group: {
                  _id: null,
                  totalCustomers: { $sum: 1 },
                  },
              },
              {
                  $project: {
                  _id: 0,
                  totalCustomers: 1,
                  },
              },
            ]);
        
            // Tính toán số lượng comment theo ngày, tuần, tháng và tất cả
            const reviewStatistics = await Review.aggregate([
            {
                $match: {
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                },
            },
            {
                $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                },
            },
            {
                $project: {
                _id: 0,
                totalReviews: 1,
                },
            },
            ]);
        
            const reviewStatisticsByWeek = await Review.aggregate([
            {
                $match: {
                createdAt: { $gte: startOfWeek, $lte: endOfWeek },
                },
            },
            {
                $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                },
            },
            {
                $project: {
                _id: 0,
                totalReviews: 1,
                },
            },
            ]);
        
            const reviewStatisticsByMonth = await Review.aggregate([
            {
                $match: {
                createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                },
            },
            {
                $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                },
            },
            {
                $project: {
                _id: 0,
                totalReviews: 1,
                },
            },
            ]);
        
            const reviewStatisticsAll = await Review.aggregate([
              {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalReviews: 1,
                },
            },
            ]);
        
            res.status(200).json({
                orders: {
                    byDay: orderStatistics[0] || { totalOrders: 0, totalRevenue: 0 },
                    byWeek: orderStatisticsByWeek[0] || { totalOrders: 0, totalRevenue: 0 },
                    byMonth: orderStatisticsByMonth[0] || { totalOrders: 0, totalRevenue: 0 },
                    all: orderStatisticsAll[0] || { totalOrders: 0, totalRevenue: 0 },
                },
                customers: {
                    byDay: customerStatistics[0] || { totalCustomers: 0 },
                    byWeek: customerStatisticsByWeek[0] || { totalCustomers: 0 },
                    byMonth: customerStatisticsByMonth[0] || { totalCustomers: 0 },
                    all: customerStatisticsAll[0] || { totalCustomers: 0 },
                  },
                reviews: {
                    byDay: reviewStatistics[0] || { totalReviews: 0 },
                    byWeek: reviewStatisticsByWeek[0] || { totalReviews: 0 },
                    byMonth: reviewStatisticsByMonth[0] || { totalReviews: 0 },
                    all: reviewStatisticsAll[0] || { totalReviews: 0 },
                },
            });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        },

    statisticalReview: async (req, res) =>{
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const { date, type } = req.body;
            const selectedDate = new Date(date);
        
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
        
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);
        
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        
            const endOfWeek = new Date(selectedDate);
            endOfWeek.setHours(23, 59, 59, 999);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
        
            const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        
            const matchCondition = {};
        
            if (type === 'day') {
                matchCondition.createdAt = { $gte: startOfDay, $lte: endOfDay };
            } else if (type === 'week') {
                matchCondition.createdAt = { $gte: startOfWeek, $lte: endOfWeek };
            } else if (type === 'month') {
                matchCondition.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
            }
        
            const totalComments = await Comment.countDocuments(matchCondition);
        
            const totalPages = Math.ceil(totalComments / limit);
            const skip = (page - 1) * limit;
        
            const commentsWithAvgRate = await Comment.aggregate([
                { $match: matchCondition },
                {
                    $group: {
                        _id: null,
                        avgRate: { $avg: '$rate' },
                        comments: { $push: '$$ROOT' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        avgRate: 1,
                        comments: {
                            $slice: ['$comments', skip, limit],
                        },
                    },
                },
            ]);
            var commentsWithDetails
            var arr 
            if (commentsWithAvgRate[0]){
                arr = commentsWithAvgRate[0].comments
            }
            if (arr){
                commentsWithDetails = await Promise.all(arr.map(async (comment) => {
                    const user = await User.findById(comment.userID);
                    const product = await Product.findById(comment.productID);
                    return {
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
                        createdAt: comment.createdAt,
                        updatedAt: comment.updatedAt,
                    }
                }))
            }

            res.status(200).json({
                [type]: {
                    comments: commentsWithDetails ? commentsWithDetails : [],
                    total: totalComments,
                    avgRate: commentsWithAvgRate[0] ? commentsWithAvgRate[0].avgRate : 0,
                    pagination: {
                        totalPages,
                        currentPage: page,
                    },
                },
            });
            

            // res.status(200).json({
            //     [type]: {
            //         comments: commentsWithAvgRate[0] ? commentsWithAvgRate[0].comments : [],
            //         total: totalComments,
            //         avgRate: commentsWithAvgRate[0] ? commentsWithAvgRate[0].avgRate : 0,
            //         pagination: {
            //             totalPages,
            //             currentPage: page,
            //         },
            //     },
            // });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    statisticalUser: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const { date, type} = req.body;
    
            if (!date || !type) {
                return res.status(400).json({ error: 'Date and type parameters are required.' });
            }
            const selectedDate = new Date(date);
    
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
    
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            const startOfWeek = new Date(selectedDate);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        
            const endOfWeek = new Date(selectedDate);
            endOfWeek.setHours(23, 59, 59, 999);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);

    
            const skip = (page - 1) * limit;
            let query = {role: ""};

            if (type === 'day') {
                query = { createdAt: { $gte: startOfDay, $lte: endOfDay }, role: "" };
            } else if (type === 'week') {
                query = { createdAt: { $gte: startOfWeek, $lte: endOfWeek }, role: "" };
            } else if (type === 'month') {
                query = { createdAt: { $gte: startOfMonth, $lte: endOfMonth }, role: "" };
            }
            // Áp dụng phân trang
            const users = await User.find(query).skip(skip).limit(parseInt(limit));
    
            // Thống kê tất cả người dùng mới
            const totalUsers = await User.countDocuments(query);

            const totalAllUser = await User.countDocuments({role: ""});
            const totalPages = Math.ceil(totalUsers / limit);
    
            res.status(200).json({
                [type]: {
                    users,
                    total: totalAllUser,
                    pagination: {
                        totalPages,
                        currentPage: parseInt(page),
                    },
                },
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    statisticalUserChart: async (req, res) => {
        try {
            const { date, type } = req.body;
    
            if (!date || !type) {
                return res.status(400).json({ error: 'Date and type parameters are required.' });
            }
    
            const selectedDate = new Date(date);
    
            let startOfPeriod, groupingKey, numberOfPeriods;
    
            if (type === 'week') {
   
                startOfPeriod = new Date(selectedDate);
                startOfPeriod.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);

                groupingKey = { $dayOfWeek: '$createdAt' };
                numberOfPeriods = 7;
            } else {
                return res.status(400).json({ error: 'Invalid type parameter.' });
            }
    
            const stats = await User.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startOfPeriod },
                    },
                },
                {
                    $group: {
                        _id: groupingKey,
                        total: { $sum: 1 },
                    },
                },
            ]);
    
            const resultArray = Array(numberOfPeriods).fill(0);
    
            stats.forEach(stat => {
                const dayOfWeek = stat._id;
                const total = stat.total;
                resultArray[dayOfWeek - 1] = total; 
            });
    
            res.status(200).json({
                stats: resultArray,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    statisticalOrder: async (req, res) => {
        try {
            const { date } = req.body;
        
            const selectedDate = new Date(date);
        
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
        
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);
        
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        
            const endOfWeek = new Date(selectedDate);
            endOfWeek.setHours(23, 59, 59, 999);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
        
            const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        
            const orderStatistics = await Order.aggregate([
              {
                $match: {
                    orderTime: { $gte: startOfDay, $lte: endOfDay },
                    state: "Hoàn thành"
                  },
              },
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 }, 
                  totalRevenue: { $sum: '$Price' },  
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
        
            const orderStatisticsByWeek = await Order.aggregate([
              {
                $match: {
                  orderTime: { $gte: startOfWeek, $lte: endOfWeek },
                  state: "Hoàn thành"
                },
              },
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: { $sum: '$Price' },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
        
            const orderStatisticsByMonth = await Order.aggregate([
              {
                $match: {
                  orderTime: { $gte: startOfMonth, $lte: endOfMonth },
                  state: "Hoàn thành"
                },
              },
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: { $sum: '$Price' },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
        
            const orderStatisticsAll = await Order.aggregate([
                {
                    $match: {
                        state: "Hoàn thành"
                    },
                },
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: { $sum: '$Price' },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalOrders: 1,
                  totalRevenue: 1,
                },
              },
            ]);
            const ordersByDay = await Order.find({state: 'Hoàn thành', orderTime: { $gte: startOfDay, $lte: endOfDay }});
            const ordersByWeek = await Order.find({ state: 'Hoàn thành', orderTime: { $gte: startOfWeek, $lte: endOfWeek } });
            const ordersByMonth = await Order.find({ state: 'Hoàn thành', orderTime: { $gte: startOfMonth, $lte: endOfMonth } });
            const allCompletedOrders = await Order.find({ state: 'Hoàn thành' });
            res.status(200).json({
                orders: {
                    byDay: orderStatistics[0] || { totalOrders: 0, totalRevenue: 0 },
                    byWeek: orderStatisticsByWeek[0] || { totalOrders: 0, totalRevenue: 0 },
                    byMonth: orderStatisticsByMonth[0] || { totalOrders: 0, totalRevenue: 0 },
                    all: orderStatisticsAll[0] || { totalOrders: 0, totalRevenue: 0 },
                },
                orderDetail: {
                    byDay: ordersByDay,
                    byWeek: ordersByWeek,
                    byMonth: ordersByMonth,
                    all: allCompletedOrders,
                }
            });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    },
    statisticalOrderChart: async (req, res) => {
        try {
            const { date } = req.body;
        
            if (!date) {
              return res.status(400).json({ error: 'Date parameter is required.' });
            }
        
            const selectedDate = new Date(date);
        
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
        
            const endOfWeek = new Date(selectedDate);
            endOfWeek.setHours(23, 59, 59, 999);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
        
            const stats = await Order.aggregate([
              {
                $match: {
                  state: 'Hoàn thành',
                  orderTime: { $gte: startOfWeek, $lte: endOfWeek },
                },
              },
              {
                $group: {
                  _id: { $dayOfWeek: '$orderTime' },
                  total: { $sum: 1 },
                },
              },
            ]);
        
            const resultArray = Array(7).fill(0);
        
            stats.forEach(stat => {
              const dayOfWeek = stat._id;
              const total = stat.total;
              resultArray[dayOfWeek - 1] = total;
            });
        
            res.status(200).json({
              stats: resultArray,
            });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },

    getStatisticalReview: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const { date, type } = req.body;
        const selectedDate = new Date(date);
    
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
    
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
    
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
        const endOfWeek = new Date(selectedDate);
        endOfWeek.setHours(23, 59, 59, 999);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
    
        const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
    
        const matchCondition = {};
    
        if (type === 'day') {
            matchCondition.createdAt = { $gte: startOfDay, $lte: endOfDay };
        } else if (type === 'week') {
            matchCondition.createdAt = { $gte: startOfWeek, $lte: endOfWeek };
        } else if (type === 'month') {
            matchCondition.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
        }
    
        const totalReviews = await Review.countDocuments(matchCondition);
    
        const totalPages = Math.ceil(totalReviews / limit);
        const skip = (page - 1) * limit;
    
        const reviewsWithAvgRate = await Review.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: null,
                    avgRate: { $avg: '$rate' },
                    reviews: { $push: '$$ROOT' },
                },
            },
            {
                $project: {
                    _id: 0,
                    avgRate: 1,
                    reviews: {
                        $slice: ['$reviews', skip, limit],
                    },
                },
            },
        ]);

        res.status(200).json({
            [type]: {
                reviews: reviewsWithAvgRate[0] ? reviewsWithAvgRate[0].reviews : [],
                total: totalReviews,
                avgRate: reviewsWithAvgRate[0] ? reviewsWithAvgRate[0].avgRate : 0,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    },
    getStatisticalReviewChart: async (req, res) => {
      try {
        const { date, type } = req.body;
    
        if (type === 'all') {
          const orderStatsByRating = await Review.aggregate([
            {
              $group: {
                _id: '$rate',
                totalOrders: { $sum: 1 },
              },
            },
          ]);
    
          const resultArray = [0, 0, 0, 0, 0];
    
          orderStatsByRating.forEach((item) => {
            resultArray[item._id - 1] = item.totalOrders;
          });
    
          res.status(200).json(resultArray);
        } else {
          const selectedDate = new Date(date);

    
          let startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth;
    
          if (type === 'day') {
            startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);
          } else if (type === 'week') {
            startOfWeek = new Date(selectedDate);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
            endOfWeek = new Date(selectedDate);
            endOfWeek.setHours(23, 59, 59, 999);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
          } else if (type === 'month') {
            startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
          } else {
            return res.status(400).json({ error: 'Invalid type parameter.' });
          }
    
          const matchCondition = {
            createdAt: { $gte: startOfDay || startOfWeek || startOfMonth, $lte: endOfDay || endOfWeek || endOfMonth },
          };
    
          const orderStatsByRating = await Review.aggregate([
            { $match: matchCondition },
            {
              $group: {
                _id: '$rate',
                totalOrders: { $sum: 1 },
              },
            },
          ]);
    
          const resultArray = [0, 0, 0, 0, 0];
    
          orderStatsByRating.forEach((item) => {
            resultArray[item._id - 1] = item.totalOrders;
          });
    
          res.status(200).json(resultArray);
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
    getStatisticalWarehouse: async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      try {
        const { date, type } = req.body;
        const resultArray = [];
        const selectedDate = new Date(date);
        let startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth;
        if (type==="all"){
          const warehouseItems = await Warehouse.find();
          for (const warehouseItem of warehouseItems) {
            const {productName, productIMG, log, quantity } = warehouseItem;
      
            // Tính tổng số lượng nhập và xuất kho
            const totalImport = log
              .filter((entry) => entry.type === 'Nhập kho')
              .reduce((total, entry) => total + entry.quantity, 0);
      
            const totalExport = log
              .filter((entry) => entry.type === 'Xuất kho')
              .reduce((total, entry) => total + Math.abs(entry.quantity), 0);
      
            resultArray.push({
              productName,
              productIMG,
              totalImport,
              totalExport,
              log,
              quantity
            });
          }
        } else {
          if (type === 'day') {
            startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);
          } else if (type === 'week') {
            startOfWeek = new Date(selectedDate);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
            endOfWeek = new Date(selectedDate);
            endOfWeek.setHours(23, 59, 59, 999);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
          } else if (type === 'month') {
            startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
          } else if (type !== 'all') {
            return res.status(400).json({ error: 'Invalid type parameter.' });
          }
      
          const matchCondition = {
            'log': {
              $elemMatch: {
                'createdAt': { $gte: startOfDay || startOfWeek || startOfMonth, $lte: endOfDay || endOfWeek || endOfMonth }
              }
            }
          };
          const warehouseItems = await Warehouse.find(matchCondition);
          // const resultArray = [];
      
          for (const warehouseItem of warehouseItems) {
            const {productName, productIMG, log, quantity } = warehouseItem;
      
            // Tính tổng số lượng nhập và xuất kho
            const totalImport = log
              .filter((entry) => entry.type === 'Nhập kho')
              .reduce((total, entry) => total + entry.quantity, 0);
      
            const totalExport = log
              .filter((entry) => entry.type === 'Xuất kho')
              .reduce((total, entry) => total + Math.abs(entry.quantity), 0);
            
            resultArray.push({
              productName,
              productIMG,
              totalImport,
              totalExport,
              log,
              quantity
            });
          }
        }
        const startIndex = (page - 1) * 8;
        const endIndex = page * 8;
        const rs = resultArray.slice(startIndex, endIndex)
        const totalPages = Math.ceil(resultArray.length / 8);
        res.status(200).json({
          warehouses: rs,
          pagination: {
            totalPages,
            currentPage: page
          }
        });
      } catch (error) {
        console.error('Error calculating total in/out:', error);
        res.status(500).json({ error: error.message });
      }
    },
}
module.exports = statisticalController;