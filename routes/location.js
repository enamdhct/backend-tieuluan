const router = require("express").Router();
const locationController = require("../controllers/locationController");
const middlewareController = require("../controllers/middlewareController");

router.post("/", locationController.addLocation);

router.post("/getLocationUser", locationController.getLocationWithUser);

router.get("/", locationController.getAllLocation);

router.get("/:id",  locationController.getLocation);

router.put("/:id", locationController.updateLocation);

router.delete("/:id", locationController.deleteLocation);



module.exports = router;