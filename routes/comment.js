const router = require("express").Router();
const commentController = require("../controllers/commentController");

router.post("/", commentController.addComment);

router.get("/",commentController.getAllComment);

router.get("/:id",commentController.getComment);

router.put("/:id", commentController.updateComment);

router.delete("/:id", commentController.deleteComment);

router.get("/getCommentProduct/:id", commentController.getCommentWithProduct)

router.post("/reply", commentController.repComment)

router.post("/deleteReply", commentController.deleteReplyComment)

router.post("/getAllCommentDetail", commentController.getAllWithDetail)

router.post("/getCommentDetail", commentController.getCommentDetail)

router.post("/getAllCommentProduct", commentController.getAllWithProduct)

router.post("/getCountCmt", commentController.getTotalCommentsPerProduct)

module.exports = router;