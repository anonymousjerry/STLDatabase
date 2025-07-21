const express = require('express');
const { getAllSites } = require('../controllers/siteController');


const router = express.Router();

router.get('/', getAllSites)

module.exports = router;