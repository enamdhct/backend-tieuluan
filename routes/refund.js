const router = require("express").Router();
const refundRequestController = require("../controllers/refundRequestController");

router.post("/", refundRequestController.addRefundRequest);

router.get("/:id",refundRequestController.getRequest);

router.put("/:id", refundRequestController.updateRequest);

router.delete("/:id", refundRequestController.deleteRequest);

router.post("/all", refundRequestController.getAll)





module.exports = router;