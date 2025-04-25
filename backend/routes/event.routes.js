const router = require("express").Router();
const eventController = require("../controllers/event.controller");
const upload = require("../middleware/upload");
const reqAuth = require("../middleware/reqAuth.js");

//creat event
router.post("/createEvent",reqAuth, upload.single("coverPicture"), eventController.createEvent);
//get all events
router.get("/getEvents", eventController.getEvents);
//delete event
router.delete("/deleteEvent/:id", reqAuth, eventController.deleteEvent);


module.exports = router;

