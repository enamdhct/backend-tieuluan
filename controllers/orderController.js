const { Order, UserVoucher, User } = require("../models/model");
const { sendMail } = require("./mail");

const orderController = {
    addOrder: async (req, res) => {
        try {
            const newOrder = new Order(req.body);
            const savedOrder = await newOrder.save();
            console.log({ user_id: req.body?.userID, req: req?.body });
            if (req?.body?.userID) {
                const user = await User.findById(req?.body?.userID);
                console.log({ user, email: user.email })
                sendMail(user?.email, "Bạn có 1 đơn hàng mới", "Bạn có 1 đơn hàng mới!", req.body, savedOrder.id)
            }

            res.status(200).json(savedOrder);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllOrder: async (req, res) => {
        try {
            const allOrder = await Order.find();
            res.status(200).json(allOrder);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAll: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1;
            const type = req.body.type;
            const skip = (page - 1) * ITEMS_PER_PAGE;
            if (type == "shiper") {
                const totalOrders = await Order.countDocuments({ state: { $nin: ['Nháp', 'Đang xử lí'] } });
                const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

                const allOrder = await Order.find({ state: { $nin: ['Nháp', 'Đang xử lí'] } })
                    .skip(skip)
                    .limit(ITEMS_PER_PAGE).sort({ createdAt: -1 });
                console.log({ allOrder });

                res.status(200).json({
                    orders: allOrder,
                    pagination: {
                        totalPages,
                        currentPage: page,
                    },
                    test: 'kkk'
                });
            } else {
                const totalOrders = await Order.countDocuments({ state: { $nin: ['Nháp'] } });
                const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

                const allOrder = await Order.find({ state: { $nin: ['Nháp'] } })
                    .skip(skip)
                    .limit(ITEMS_PER_PAGE).sort({ createdAt: -1 });

                res.status(200).json({
                    orders: allOrder,
                    pagination: {
                        totalPages,
                        currentPage: page,
                    },
                });
            }

        } catch (err) {
            res.status(500).json(err);
        }
    },
    getOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            console.log({ order });

            res.status(200).json(order);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getOrderUser: async (req, res) => {
        try {
            const userID = req.params.id
            const orders = await Order.find()
            const filteredOrders = orders.filter(order => order.userID === userID);
            res.status(200).json(filteredOrders);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getOrderUserPaignation: async (req, res) => {
        try {
            const userID = req.body.userID;
            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = 8;

            const orders = await Order.find({ userID: userID })
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .exec();

            const totalOrders = await Order.countDocuments({ userID: userID });

            const totalPages = Math.ceil(totalOrders / itemsPerPage);

            res.status(200).json({
                orders: orders,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages
                }
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateOrder: async (req, res) => {
        try {
            console.log({ body: req.body });

            const order = await Order.findById(req.params.id);
            const orderUpdate = await order.updateOne({ $set: req.body });
            console.log({orderUpdate});
            
            if (req.body.voucherId) {
                const voucherUse = await UserVoucher.findById(req.body.voucherId)
                console.log({ voucherUse });
                await voucherUse.updateOne({ $set: { is_use: true } })
            }
            if (req?.body?.userID) {
                const user = await User.findById(req?.body?.userID);
                if(req.body.coinApply && req.body.coinApply > 0){
                    const coinUpdate = user.coin > 0 ? user.coin - req.body.coinApply  : 0;
                    console.log({coinUpdate});
                    
                    await user.updateOne({$set:{coin: coinUpdate}})
                }
                console.log({ user, email: user.email })
                sendMail(user?.email, "Bạn có 1 đơn hàng mới", "Bạn có 1 đơn hàng mới!", req.body, order.id)
            }
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            console.log({ err: err.message });

            res.status(500).json(err);
        }
    },
    deleteOrder: async (req, res) => {
        try {
            await Order.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getOrderWithStatus: async (req, res) => {
        try {
            const state = req.body.state
            const orders = await Order.find()
            const filteredOrders = orders.filter(order => order.state === state);
            res.status(200).json(filteredOrders);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    searchOrder: async (req, res) => {
        try {
            const searchValue = req.body.text
            const order = await Order.findById(searchValue);
            console.log(order);
            if (order) {
                res.status(200).json({
                    orders: order,
                })
            } else {
                const filteredOrders = await Order.find({
                    userID: { $regex: new RegExp(searchValue, "i") },
                });
                let count = filteredOrders.length
                res.status(200).json({
                    orders: filteredOrders,
                    count: count
                })
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = orderController;