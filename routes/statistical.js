const router = require("express").Router();
const statisticalController = require("../controllers/statisticalController")
const middlewareController = require("../controllers/middlewareController");

router.post("/getStatistical",middlewareController.verifyTokenAndAdminAuth, statisticalController.getStatistical)

router.post("/getStatisticalWithDay",middlewareController.verifyTokenAndAdminAuth, statisticalController.getStatisticalWithDay)

router.post("/statisticalReview",middlewareController.verifyTokenAndAdminAuth, statisticalController.getStatisticalReview)

router.post("/statisticalUser",middlewareController.verifyTokenAndAdminAuth, statisticalController.statisticalUser)

router.post("/statisticalUseChart",middlewareController.verifyTokenAndAdminAuth, statisticalController.statisticalUserChart)

router.post("/statisticalOrder",middlewareController.verifyTokenAndAdminAuth, statisticalController.statisticalOrder)

router.post("/statisticalOrderChart",middlewareController.verifyTokenAndAdminAuth, statisticalController.statisticalOrderChart)

router.post("/statisticalReviewChart",middlewareController.verifyTokenAndAdminAuth, statisticalController.getStatisticalReviewChart)

router.post("/statisticalWarehouse",middlewareController.verifyTokenAndAdminAuth, statisticalController.getStatisticalWarehouse)

module.exports = router;