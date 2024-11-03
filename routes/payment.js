const router = require("express").Router();
const paymentController = require("../controllers/paymentController");

router.post("/", paymentController.addPayment);

router.get("/",paymentController.getAllPayment);

router.get("/:id",paymentController.getPayment);

router.put("/:id", paymentController.updatePayment);

router.delete("/:id", paymentController.deletePayment);

router.post("/create_payment_url", paymentController.paymentVNP)



module.exports = router;