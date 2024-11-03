const {Warehouse, User} = require("../models/model");


const warehouseController = {
    addWarehouse: async(req, res) => {
        try {
            const newWarehouse = new Warehouse(req.body);
            const savedWarehouse = await newWarehouse.save();
            res.status(200).json(savedWarehouse);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllWarehouse: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1; // Lấy số trang từ query params hoặc mặc định là 1
            const skip = (page - 1) * ITEMS_PER_PAGE;
    
            const totalProducts = await Warehouse.countDocuments();
            const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    
            const allProduct = await Warehouse.find()
                .skip(skip)
                .limit(ITEMS_PER_PAGE);
    
            res.status(200).json({
                warehouses: allProduct,
                pagination: {
                    totalPages,
                    currentPage: page,
                },
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // getAllWarehouse: async(req, res) => {
    //     try {
    //         const allWarehouse = await Warehouse.find();
    //         res.status(200).json(allWarehouse);
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },
    getWarehouse: async(req, res) => {
        try {
            const warehouse = await Warehouse.findById(req.params.id);
            res.status(200).json(warehouse);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateWarehouse: async(req, res) => {
        try {
            const warehouse = await Warehouse.findById(req.params.id);
            await warehouse.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteWarehouse: async (req, res) => {
        try {
            await Warehouse.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteWarehouseWithProductID: async (req, res)=> {
        try {
            let productID = req.body.productID
            const warehouses = await Warehouse.find({productID})
            if (warehouses){
                await Warehouse.findByIdAndDelete(warehouses[0]._id)
            }
            res.status(200).json("Deleted successfully!")
        } catch (err){
            res.status(500).json(err);
        }

    },
    getWarehouseWithProductID: async (req, res)=> {
        try {
            let productID = req.body.productID
            const warehouses = await Warehouse.find({productID})
      
            res.status(200).json(warehouses)
        } catch (err){
            res.status(500).json(err);
        }

    },
    importProduct: async (req, res) => {
        const { quantity, userID, warehouseId, type, note} = req.body;
        try {
          const parentWarehouse = await Warehouse.findById(warehouseId);
          if (!parentWarehouse) {
            return res.status(404).json({ error: 'Warehouse not found' });
          }
          parentWarehouse.log.push({ quantity, userID, type, note });
          await parentWarehouse.save();

          const totalLogQuantity = parentWarehouse.log.reduce(
                (total, logEntry) => total + logEntry.quantity,0);
            parentWarehouse.quantity = totalLogQuantity;

            // Lưu lại các thay đổi
            await parentWarehouse.save();
      
          res.status(201).json(parentWarehouse);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    exportProduct: async (req, res) => {
        const { quantity, userID, warehouseId, type, note } = req.body;
        try {
          const parentWarehouse = await Warehouse.findById(warehouseId);
          if (!parentWarehouse) {
            return res.status(404).json({ error: 'Warehouse not found' });
          }
          parentWarehouse.log.push({ quantity: -quantity, userID, type, note });
          await parentWarehouse.save();

          const totalLogQuantity = parentWarehouse.log.reduce(
                (total, logEntry) => total + logEntry.quantity,0);
            parentWarehouse.quantity = totalLogQuantity;

            // Lưu lại các thay đổi
            await parentWarehouse.save();
      
          res.status(201).json(parentWarehouse);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    searchProduct: async (req, res)=> {
        try {
            const searchValue = req.body.text
            const filteredProducts = await Warehouse.find({
                productName: { $regex: new RegExp(searchValue, "i") } 
            });
            let count = filteredProducts.length  
            res.status(200).json({
                products: filteredProducts,
                count: count
            })
        } catch (err){
            res.status(500).json(err);
        }

    },
    searchWareWithUser: async (req, res)=>{
        try {
            const name = req.body.name;
            const warehouseID = req.body.warehouseID
            const user = await User.findOne({ name });
        
            if (!user) {
              return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            const warehouse = await Warehouse.findOne({
                'log.userID': user._id.toString(),
                _id: warehouseID,
              });
              if (!warehouse) {
                return res.status(404).json({ message: 'Kho hàng không tồn tại cho người dùng này' });
              }
              const userLogs = warehouse.log.filter(log => log.userID === user._id.toString());
              warehouse.log = userLogs;
        
            res.status(200).json({ warehouse });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    },
    getLogByUserID: async (req, res)=>{
        const ITEMS_PER_PAGE = 8;
        try {
            const page = req.query.page || 1;
            const { userID } = req.body;
            const skip = (page - 1) * ITEMS_PER_PAGE;
            const result = await Warehouse.aggregate([
                {
                    $match: {
                        'log.userID': userID,
                    },
                },
                {
                    $unwind: '$log',
                },
                {
                    $match: {
                        'log.userID': userID,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        'log.userID': 1,
                        'log.quantity': 1,
                        'log.type': 1,
                        'log.note': 1,
                        'log.createdAt': 1,
                        productInfo: {
                            productName: '$productName',
                            productIMG: '$productIMG',
                        },
                    },
                },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: ['$log', '$productInfo'] } },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: ITEMS_PER_PAGE,
                },
            ]);
            res.status(200).json({
                logs: result,
                pagination: {
                    totalPages: Math.ceil(result.length / ITEMS_PER_PAGE),
                    currentPage: page,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getLogWarehouse: async (req, res) => {
        const ITEMS_PER_PAGE = 8;
      
        try {
          const page = req.query.page || 1;
          const { warehouseId } = req.body;
      
          if (!warehouseId) {
            return res.status(400).json({ error: 'Missing warehouseId in the request body' });
          }
      
          const warehouse = await Warehouse.findById(warehouseId);
      
          if (!warehouse) {
            return res.status(404).json({ error: 'Warehouse not found' });
          }
      
          const logs = warehouse.log || [];
    
          const startIndex = (page - 1) * ITEMS_PER_PAGE;
          const endIndex = page * ITEMS_PER_PAGE;
          const paginatedLogs = logs.slice(startIndex, endIndex);
      
          res.status(200).json({
            logs: paginatedLogs,
            product: {
                productName: warehouse.productName,
                productIMG: warehouse.productIMG
            },
            pagination: {
              totalPages: Math.ceil(logs.length / ITEMS_PER_PAGE),
              currentPage: page,
            },
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }

}
module.exports = warehouseController;