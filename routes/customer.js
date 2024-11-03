const router = require("express").Router();
const customerController = require("../controllers/customerController");

router.post("/", customerController.addCustomer);

router.get("/",customerController.getAllCustomer);

router.get("/:id",customerController.getCustomer);

router.put("/:id", customerController.updateCustomer);

router.delete("/:id", customerController.deleteCustomer);



module.exports = router;