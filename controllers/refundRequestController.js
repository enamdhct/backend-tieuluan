const { Voucher, UserVoucher, RefundRequest, Order, User, Product, Warehouse } = require("../models/model");
const { sendMail } = require("./mail");
require('dotenv').config();

const refundRequestController = {

    addRefundRequest: async (req, res) => {
        try {
            console.log(req.body);
            const order = await Order.findById(req.body.order_id);
            req.body = {
                ...req.body,
                request_date: new Date(),
                refund_amount: order.Price,
                status: "Chờ duyệt"
            }
            const newRequest = new RefundRequest(req.body);
            const savedRequest = await newRequest.save();
            await order.updateOne({ $set: {state:"Refund:Chờ duyệt"} });
            const user = await User.findById(req?.body?.user_id);
            sendMail(user?.email, "Bạn có 1 yêu cầu hoàn đơn mới", "Bạn có 1 yêu cầu hoàn đơn mới!", order, order._id)

            res.status(200).json(savedRequest);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAll: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1;
            const skip = (page - 1) * ITEMS_PER_PAGE;

            const totalVouchers = await RefundRequest.countDocuments();
            const totalPages = Math.ceil(totalVouchers / ITEMS_PER_PAGE);

            let allRequest = await RefundRequest.find({ name: { $ne: 'Tất cả' } })
                .skip(skip)
                .limit(ITEMS_PER_PAGE);
            allRequest = await Promise.all(allRequest.map(async(req)=>{
                    const detailOrder = await Order.findById(req.order_id);
                    return {
                        ...req._doc,
                        detailOrder
                    }
                }))
            res.status(200).json({
                requests: allRequest,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getRequest: async (req, res) => {
        try {
            console.log({id:req.params.id});
            
            let request = await RefundRequest.findById(req.params.id);
            console.log({request});

            const detailOrder = await Order.findById(request.order_id)
            
            request = {
                ...request._doc,
                detailOrder
            }
            console.log({request});
            
            res.status(200).json(request);
        } catch (err) {
            console.log({err});
            
            res.status(500).json(err);
        }
    },
    updateRequest: async (req, res) => {
        try {
            console.log({id:req.params.id});
            
            const request = await RefundRequest.findById(req.params.id);
            const order = await Order.findById(request.order_id);

            await request.updateOne({ $set: req.body });
            await order.updateOne({ $set: {state:"Refund:"+req.body.status} });
            const user = await User.findById(request?.user_id);
            sendMail(user?.email, `Đơn hàng cần hoàn đơn ${order._id} đang ở trạng thái ${req.body.status}`, `Đơn hàng cần hoàn đơn ${order._id} đang ở trạng thái ${req.body.status}!`, order, order._id,'default',req.body.status != 'Hoàn thành' ? `Vui lòng gửi hàng đến địa chỉ ${process.env.ADDRESS_SHOP}`:"")
            if(user && req.body.status=='Hoàn thành'){
                await user.updateOne({$set : {coin: request.refund_amount}});
                console.log({length: order?.product.length});
                
                if(order && order?.product.length > 0){
                    await Promise.all(order?.product.map(async(pro)=>{
                        const warehouse = await Warehouse.findOne({productID: pro?.productID});
                        console.log({quantity:warehouse.quantity + pro.quantity});
                        
                       return  await warehouse.updateOne({$set : {quantity: warehouse.quantity + pro.quantity}});
                    }))
                }
            }
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            console.log({err});
            
            res.status(500).json(err);
        }
    },
    deleteRequest: async (req, res) => {
        try {

            await RefundRequest.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }
  
}
module.exports = refundRequestController;