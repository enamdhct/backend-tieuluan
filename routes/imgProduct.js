const router = require("express").Router();
const imgProductController = require("../controllers/imgProductController");

router.post("/", imgProductController.addImgProduct);

router.get("/",imgProductController.getAllImgProduct);

router.get("/:id",imgProductController.getImgProduct);

router.put("/:id", imgProductController.updateImgProduct);

router.delete("/:id", imgProductController.deleteImgProduct);



module.exports = router;