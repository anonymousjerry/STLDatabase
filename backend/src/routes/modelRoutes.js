const express = require('express')
const { getAllModels, getTrendingModels } = require('../controllers/modelController');
// const authenticate = require('../middlewares/authMiddleware')


const router = express.Router();

router.get('/', getAllModels)
router.get('/trending', getTrendingModels)

module.exports = router;