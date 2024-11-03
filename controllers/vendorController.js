const {Vendor} = require("../models/model");

const vendorController = {
    addVendor: async(req, res) => {
        try {
            const newVendor = new Vendor(req.body);
            const savedVendor = await newVendor.save();
            res.status(200).json(savedVendor);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllVendor: async(req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            const skip = (page - 1) * limit;
            const vendors = await Vendor.find()
                .skip(skip)
                .limit(limit);
    
            const totalVendors = await Vendor.countDocuments();
            const totalPages = Math.ceil(totalVendors / limit);
    
            res.status(200).json({
                vendors,
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
    getVendor: async(req, res) => {
        try {
            const vendor = await Vendor.findById(req.params.id);
            res.status(200).json(vendor);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateVendor: async(req, res) => {
        try {
            const vendor = await Vendor.findById(req.params.id);
            await vendor.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteVendor: async (req, res) => {
        try {

            await Vendor.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = vendorController;