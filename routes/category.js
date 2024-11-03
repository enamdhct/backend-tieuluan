const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

router.post("/", categoryController.addCategory);

router.get("/",categoryController.getAllCategory);

router.get("/:id",categoryController.getCategory);

router.put("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

router.post("/all", categoryController.getAll)



module.exports = router;