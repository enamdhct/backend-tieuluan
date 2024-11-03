const router = require("express").Router();
const reviewController = require("../controllers/reviewController");

router.post("/", reviewController.addReview);

router.get("/",reviewController.getAllReview);

router.get("/:id",reviewController.getReview);

router.get("/getReviewOfUser/:id", reviewController.getReviewOfUser)

router.put("/:id", reviewController.updateReview);

router.delete("/:id", reviewController.deleteReview);

router.post("/search", reviewController.searchReview);

module.exports = router;