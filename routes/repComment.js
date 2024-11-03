const router = require("express").Router();
const repCommentController = require("../controllers/repCommentController");

router.post("/", repCommentController.addRepComment);

router.get("/",repCommentController.getAllRepComment);

router.get("/:id",repCommentController.getRepComment);

router.put("/:id", repCommentController.updateRepComment);

router.delete("/:id", repCommentController.deleteRepComment);



module.exports = router;