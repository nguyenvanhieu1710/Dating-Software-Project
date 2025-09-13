const express = require("express");
const router = express.Router();

// Import all routes
const userRoute = require("./userRoute");
const uploadRoute = require("./uploadRoute");
const profileRoute = require("./profileRoute");
const swipeRoute = require("./swipeRoute");
const matchRoute = require("./matchRoute");
const photoRoute = require("./photoRoute");
const settingsRoute = require("./settingsRoute");
const subscriptionRoute = require("./subscriptionRoute");
const consumableRoute = require("./consumableRoute");
const adminRoute = require("./adminRoute");

// Register all routes
router.use("/user", userRoute);
router.use("/upload", uploadRoute);
router.use("/profile", profileRoute);
router.use("/swipe", swipeRoute);
router.use("/match", matchRoute);
router.use("/photo", photoRoute);
router.use("/settings", settingsRoute);
router.use("/subscription", subscriptionRoute);
router.use("/consumable", consumableRoute);
router.use("/admin", adminRoute);

module.exports = router;
