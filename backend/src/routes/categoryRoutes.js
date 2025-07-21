const express = require('express');
const { getAllSubcategories } = require('../controllers/categoryController');


const router = express.Router();

router.get('/', getAllSubcategories)

module.exports = router;