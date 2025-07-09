const express = require('express');
const router = express.Router();
const { handleCommand } = require('../controllers/commandController');

router.post('/', handleCommand);

module.exports = router;
