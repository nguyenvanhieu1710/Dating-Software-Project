const express = require('express');
const router = express.Router();
const emailController = require('../app/controllers/emailController');

// POST api/email/send-all
router.post('/send-all', emailController.sendToAllUsers);

// POST api/email/send-specific
router.post('/send-specific', emailController.sendToSpecificUsers);

module.exports = router;