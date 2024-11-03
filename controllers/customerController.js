const {Customer} = require("../models/model");

const customerController = {
    addCustomer: async(req, res) => {
        try {
            const newCustomer = new Customer(req.body);
            const savedCustomer = await newCustomer.save();
            res.status(200).json(savedCustomer);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllCustomer: async(req, res) => {
        try {
            const allCustomer = await Customer.find();
            res.status(200).json(allCustomer);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getCustomer: async(req, res) => {
        try {
            const customer = await Customer.findById(req.params.id);
            res.status(200).json(customer);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateCustomer: async(req, res) => {
        try {
            const customer = await Customer.findById(req.params.id);
            await customer.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteCustomer: async (req, res) => {
        try {

            await Customer.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = customerController;