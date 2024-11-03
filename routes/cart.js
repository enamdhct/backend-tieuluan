const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.post("/", cartController.addCart);

router.get("/",cartController.getAllCart);

router.get("/:id",cartController.getCart);

router.get("/getCartOfUser/:id", cartController.getCartOfUser)

router.put("/:id", cartController.updateCart);

router.delete("/:id", cartController.deleteCart);



module.exports = router;