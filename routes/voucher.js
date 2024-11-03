const router = require("express").Router();
const voucherController = require("../controllers/voucher");

router.post("/", voucherController.addVoucher);

router.get("/",voucherController.getAllVoucher);

router.get("/:id",voucherController.getVoucher);

router.get("/user/:id",voucherController.getVoucherUser);


router.put("/:id", voucherController.updateVoucher);

router.delete("/:id", voucherController.deleteVoucher);

router.post("/all", voucherController.getAll)

router.post("/saveToUser", voucherController.saveVoucherToUser)




module.exports = router;