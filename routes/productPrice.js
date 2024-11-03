const router = require("express").Router();
const productDetailController = require("../controllers/productDetailController");

router.post("/", productDetailController.addProductDetail);

router.get("/",productDetailController.getAllProductDetail);

router.get("/:id",productDetailController.getProductDetail);

router.put("/:id", productDetailController.updateProductDetail);

router.delete("/:id", productDetailController.deleteProductDetail);



module.exports = router;