const router = require("express").Router;
const voteController = require("./controller");
router.post("/vote", voteController.setUserVote);

module.exports = router;
