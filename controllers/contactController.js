const {Contact} = require("../models/model");

const contactController = {
    addContact: async(req, res) => {
        try {
            const newContact = new Contact(req.body);
            const savedContact = await newContact.save();
            res.status(200).json(savedContact);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllContact: async(req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1;
            const skip = (page - 1) * ITEMS_PER_PAGE;
            const totalContact = await Contact.countDocuments();
            const allContact = await Contact.find().skip(skip).limit(ITEMS_PER_PAGE);
            const totalPages = Math.ceil(totalContact / ITEMS_PER_PAGE);
            
            res.status(200).json({
                contacts: allContact,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getContact: async(req, res) => {
        try {
            const contact = await Contact.findById(req.params.id);
            res.status(200).json(contact);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateContact: async(req, res) => {
        try {
            const contact = await Contact.findById(req.params.id);
            await contact.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteContact: async (req, res) => {
        try {

            await Contact.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = contactController;