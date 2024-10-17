const router = require("express").Router();
const pollController = require("./controller");

router.get("/", pollController.getPolls);
router.post("/", pollController.createPoll);

module.exports = router;
