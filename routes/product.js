const router = require("express").Router();
const productController = require("../controllers/productController");
const middlewareController = require("../controllers/middlewareController");

router.post("/",middlewareController.verifyTokenAndAdminAuth, productController.addProduct);

router.get("/", productController.getAllProduct);

router.get("/:id",productController.getProduct);

router.post("/search",productController.searchProduct);

router.put("/:id",middlewareController.verifyTokenAndAdminAuth, productController.updateProduct);

router.delete("/:id",middlewareController.verifyTokenAndAdminAuth, productController.deleteProduct);

router.post("/getProductCategory",productController.getProductWithCategory);

router.post("/getBestProduct",productController.getBestProduct);

router.post("/all", productController.getAll)

router.post("/updateStateProduct",middlewareController.verifyTokenAndAdminAuth, productController.updateStateProduct);


module.exports = router;