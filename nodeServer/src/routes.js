const router = require("express").Router();

const pollRouter = require("./poll/router");

router.use("/polls", pollRouter);

module.exports = router;
