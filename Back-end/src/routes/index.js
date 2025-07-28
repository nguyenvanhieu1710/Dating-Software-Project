const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const uploadRoute = require("./uploadRoute");

router.use("/user", userRoute);
router.use("/upload", uploadRoute);

module.exports = router;
