const router = require("express").Router();
const requestBuild = require("../controllers/requestBuildController");

router.post("/", requestBuild.addRequestBuild);

router.get("/",requestBuild.getAllRequestBuild);

router.get("/:id",requestBuild.getRequestBuild);

router.put("/:id", requestBuild.updateRequestBuild);

router.delete("/:id", requestBuild.deleteRequestBuild);



module.exports = router;