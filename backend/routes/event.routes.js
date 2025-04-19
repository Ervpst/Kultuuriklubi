const router = require("express").Router();
const eventController = require("../controllers/event.controller");
const upload = require("../middleware/upload");
const reqAuth = require("../middleware/reqAuth.js");


router.post("/createEvent", upload.single("coverPicture"), eventController.createEvent);

router.get("/getEvents", eventController.getEvents);

router.delete("/deleteEvent/:id", reqAuth, eventController.deleteEvent);


module.exports = router;