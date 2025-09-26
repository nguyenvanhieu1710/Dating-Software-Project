const express = require("express");
const router = express.Router();

// Import all routes
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const uploadRoute = require("./uploadRoute");
const profileRoute = require("./profileRoute");
const swipeRoute = require("./swipeRoute");
const messageRoute = require("./messageRoute");
const matchRoute = require("./matchRoute");
const photoRoute = require("./photoRoute");
const settingsRoute = require("./settingsRoute");
const subscriptionRoute = require("./subscriptionRoute");
const consumableRoute = require("./consumableRoute");
const adminRoute = require("./adminRoute");
const interestRoute = require("./interestRoute");
const goalRoute = require("./goalRoute");

// Register all routes
router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/upload", uploadRoute);
router.use("/profile", profileRoute);
router.use("/swipe", swipeRoute);
router.use("/message", messageRoute);
router.use("/match", matchRoute);
router.use("/photo", photoRoute);
router.use("/settings", settingsRoute);
router.use("/subscription", subscriptionRoute);
router.use("/consumable", consumableRoute);
router.use("/interests", interestRoute);
router.use("/goals", goalRoute);

module.exports = router;
