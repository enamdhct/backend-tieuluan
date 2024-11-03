const router = require("express").Router();
const contactController = require("../controllers/contactController");

router.post("/", contactController.addContact);

router.get("/",contactController.getAllContact);

router.get("/:id",contactController.getContact);

router.put("/:id", contactController.updateContact);

router.delete("/:id", contactController.deleteContact);



module.exports = router;