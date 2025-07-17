const express = require('express')
const { getAllModels } = require('../controllers/modelController');
// const authenticate = require('../middlewares/authMiddleware')


const router = express.Router();

router.get('/', getAllModels)

module.exports = router;