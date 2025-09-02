const express = require('express');
const router = express.Router();
const { startScraping } = require('../controllers/webhookController');

router.post('/scrape-job', startScraping);

module.exports = router;