const { Voucher, UserVoucher } = require("../models/model");

const voucherController = {

    getVoucherUser: async(req,res)=>{
        try{
            //
            const voucherUser = await UserVoucher.find({ user_id: { $eq: req.params.id },is_use:{$eq: false} });
            const vouchers = await Promise.all(voucherUser.map(async (voucher) =>{
                const detailVoucher = await Voucher.findById(voucher?.voucher_id)
                return {
                    ...voucher?._doc,
                    detailVoucher
                }
            }))
            res.status(200).json({voucherUser:vouchers});

        }catch(err){
            console.log({err});
        }
    },
    addVoucher: async (req, res) => {
        try {
            console.log(req.body);
            const newVoucher = new Voucher(req.body);
            const savedVoucher = await newVoucher.save();
            res.status(200).json(savedVoucher);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    saveVoucherToUser: async (req, res) => {
        try {
            console.log(req.body);
            const voucher = await Voucher.findById(req.body?.voucher_id);
            console.log({voucher});
            
            if (!voucher || Number(voucher?.number) <= 0)
                return res.status(400).json({
                    message: "Het ma giam gia nay!!!",
                    status: 400
                });

            const voucherUser = await UserVoucher.findOne({ user_id: req?.body.user_id, voucher_id: req.body?.voucher_id });
            console.log({ voucherUser });

            if (voucherUser)
                return res.status(400).json({
                    message: "Ban da so huu ma giam gia nay!!!",
                    status: 400
                });

            req.body = {
                ...req.body,
                is_use: false
            }
            const newVoucherUser = new UserVoucher(req.body);
            const savedVoucherUser = await newVoucherUser.save();
            console.log({ voucher });

            if (voucher) {
                voucher.number = Number(voucher.number) - 1;
                await voucher.save();
            }
            res.status(200).json({ ...savedVoucherUser, status: 200 });
        } catch (err) {
            console.log("saveVoucherToUser", { err });

            res.status(500).json(err);
        }
    },
    getAllVoucher: async (req, res) => {
        try {
            const allVoucher = await Voucher.find();
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

            const totalVouchers = await Voucher.countDocuments();
            const totalPages = Math.ceil(totalVouchers / ITEMS_PER_PAGE);

            const allVoucher = await Voucher.find({ name: { $ne: 'Tất cả' } })
                .skip(skip)
                .limit(ITEMS_PER_PAGE);

            res.status(200).json({
                vouchers: allVoucher,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getVoucher: async (req, res) => {
        try {
            const voucher = await Voucher.findById(req.params.id);
            res.status(200).json(voucher);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateVoucher: async (req, res) => {
        try {
            const voucher = await Voucher.findById(req.params.id);
            await voucher.updateOne({ $set: req.body });
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteVoucher: async (req, res) => {
        try {

            await Voucher.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}
module.exports = voucherController;