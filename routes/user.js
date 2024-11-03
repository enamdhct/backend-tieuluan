const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/", userController.addUser);

router.get("/",userController.getAllUser);

router.get("/:id",userController.getUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

router.post("/search", userController.searchUser)

router.post("/all", userController.getAllUserPaignation)

router.post("/updateInfo", userController.updateUserInfo)

router.post("/change-password", userController.changePassword)



module.exports = router;