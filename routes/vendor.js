const router = require("express").Router();
const vendorController = require("../controllers/vendorController");

router.post("/", vendorController.addVendor);

router.get("/",vendorController.getAllVendor);

router.get("/:id",vendorController.getVendor);

router.put("/:id", vendorController.updateVendor);

router.delete("/:id", vendorController.deleteVendor);



module.exports = router;