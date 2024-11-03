const {RequestBuild, User} = require("../models/model");
const { sendMail } = require("./mail");

const requestBuildController = {
    addRequestBuild: async(req, res) => {
        try {
            const newRequestBuild = new RequestBuild(req.body);
            console.log("hihih", newRequestBuild);
            let savedRequestBuild = await newRequestBuild.save();
            console.log({savedRequestBuild});
            if (savedRequestBuild?.userID) {
                const dataRequest =req.body;
                console.log({dataRequest});
                
                const user = await User.findById(dataRequest?.userID);
                console.log({ user, email: user.email })
                const products = [];
                let totalPrice = 0
                const product= dataRequest.product
                for(let key in product){
                    console.log({key});
                    
                    if(dataRequest.product[key]){
                        products.push(dataRequest.product[key])
                        totalPrice += dataRequest.product[key].totalPrice
                    }
                  
                }
                console.log({products,totalPrice});
                
                dataRequest.product = products
                dataRequest.Price = totalPrice
                console.log({dataRequestAfter: dataRequest});
                
                sendMail(user?.email, "Bạn có 1 yêu cầu mới", "Bạn có 1 yêu cầu mới!", dataRequest, dataRequest.id,"special")
            }
            res.status(200).json(savedRequestBuild);
        } catch (err) {
            console.log({err});
            
            res.status(500).json(err);
        }
    },
    getAllRequestBuild: async(req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            const skip = (page - 1) * limit;
            const requestBuilds = await RequestBuild.find()
                .skip(skip)
                .limit(limit);
    
            const totalRequestBuilds = await RequestBuild.countDocuments();
            const totalPages = Math.ceil(totalRequestBuilds / limit);
    
            res.status(200).json({
                requestBuilds,
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
    getRequestBuild: async(req, res) => {
        try {
            const requestBuild = await RequestBuild.findById(req.params.id);
            res.status(200).json(requestBuild);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateRequestBuild: async(req, res) => {
        try {
            const requestBuild = await RequestBuild.findById(req.params.id);
            await requestBuild.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteRequestBuild: async (req, res) => {
        try {

            await RequestBuild.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    }

}
module.exports = requestBuildController;