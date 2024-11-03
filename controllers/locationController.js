const {LocationDelivery} = require("../models/model");

const locationController = {
    addLocation: async(req, res) => {
        try {
            const newLocation = new LocationDelivery(req.body);
            const savedLocation = await newLocation.save();
            res.status(200).json(savedLocation);
        } catch (err) {
            res.status(500).json(err);
        }
    },
     // Số bản ghi trên mỗi trang

    getLocationWithUser: async (req, res)=> {
        try {
            const user = req.body.userID
            const locations = await LocationDelivery.find()
            const filteredLocations = locations.filter(location => location.userID === user);
            let count = filteredLocations.length  
            
            res.status(200).json({
                locations: filteredLocations,
                count: count
            })
        } catch (err){
            res.status(500).json(err);
        }

    },
    searchLocation: async (req, res)=> {
        try {
            const searchValue = req.body.text
            const filteredLocations = await LocationDelivery.find({
                name: { $regex: new RegExp(searchValue, "i") } 
            });
            let count = filteredLocations.length  
            res.status(200).json({
                locations: filteredLocations,
                count: count
            })
        } catch (err){
            res.status(500).json(err);
        }

    },

    getAllLocation: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1; // Lấy số trang từ query params hoặc mặc định là 1
            const skip = (page - 1) * ITEMS_PER_PAGE;
    
            const totalLocations = await LocationDelivery.countDocuments();
            const totalPages = Math.ceil(totalLocations / ITEMS_PER_PAGE);
    
            const allLocation = await LocationDelivery.find()
                .skip(skip)
                .limit(ITEMS_PER_PAGE);
    
            res.status(200).json({
                locations: allLocation,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    getLocation: async(req, res) => {
        try {
            const location = await LocationDelivery.findById(req.params.id);
            res.status(200).json(location);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateLocation: async(req, res) => {
        try {
            const location = await LocationDelivery.findById(req.params.id);
            await location.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteLocation: async (req, res) => {
        try {

            await LocationDelivery.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = locationController;