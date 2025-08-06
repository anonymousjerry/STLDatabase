const express = require('express');
const router = express.Router();
const { startScraping } = require('../controllers/webhookController');

router.post('/strapi-webhook', startScraping);

module.exports = router;