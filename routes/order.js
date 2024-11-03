const router = require("express").Router();
const orderController = require("../controllers/orderController");
const middlewareController = require("../controllers/middlewareController");

router.post("/", orderController.addOrder);

router.get("/",  orderController.getAllOrder);

router.get("/:id", orderController.getOrder);

router.put("/:id", orderController.updateOrder);

router.delete("/:id", orderController.deleteOrder);

router.get("/userOrder/:id", orderController.getOrderUser)

router.post("/getOrderWithState", orderController.getOrderWithStatus)

router.post("/search", orderController.searchOrder)

router.post("/all", orderController.getAll)

router.post("/userOrderDash", orderController.getOrderUserPaignation)



module.exports = router;