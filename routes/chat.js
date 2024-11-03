const router = require("express").Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.addChat);

router.get("/",chatController.getAllChat);

router.get("/:id",chatController.getChat);



module.exports = router;