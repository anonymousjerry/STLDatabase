const express = require('express');
const { getAllCategories } = require('../controllers/categoryController');
// const authenticate = require('../middlewares/authMiddleware')


const router = express.Router();

router.get('/', getAllCategories)

module.exports = router;