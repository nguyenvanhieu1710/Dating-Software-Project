const express = require("express");
const UserController = require("../app/controllers/UserController");
const userController = new UserController();

const router = express.Router();

// CRUD routes
router.get("/", (req, res) => userController.getAll(req, res));
router.get("/:id", (req, res) => userController.getById(req, res));
router.post("/", (req, res) => userController.create(req, res));
router.put("/:id", (req, res) => userController.update(req, res));
router.delete("/:id", (req, res) => userController.delete(req, res));

// Custom routes
router.get("/with-profiles", (req, res) =>
  userController.getAllWithProfiles(req, res)
);
router.get("/email/:email", (req, res) => userController.findByEmail(req, res));
router.post("/with-profile", (req, res) =>
  userController.createWithProfile(req, res)
);

module.exports = router;
