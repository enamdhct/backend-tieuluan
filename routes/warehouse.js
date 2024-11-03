const router = require("express").Router();
const warehouseController = require("../controllers/warehouseController");

router.post("/", warehouseController.addWarehouse);

router.get("/",warehouseController.getAllWarehouse);

router.get("/:id",warehouseController.getWarehouse);

router.put("/:id", warehouseController.updateWarehouse);

router.delete("/:id", warehouseController.deleteWarehouse);

router.post("/importProduct", warehouseController.importProduct)

router.post("/exportProduct", warehouseController.exportProduct)

router.post("/search", warehouseController.searchProduct)

router.post("/deleteWithProductID", warehouseController.deleteWarehouseWithProductID)

router.post("/searchUserWithName", warehouseController.searchWareWithUser)

router.post("/getLogByUserID", warehouseController.getLogByUserID)

router.post("/getWareByProductID", warehouseController.getWarehouseWithProductID)

router.post("/getLogWarehouse", warehouseController.getLogWarehouse)

module.exports = router;