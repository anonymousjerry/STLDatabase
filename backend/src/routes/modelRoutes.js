const express = require('express')
const { getAllModels, getTrendingModels, modelLike, modelFavourite, getModel, getSimilars } = require('../controllers/modelController');
// const authenticate = require('../middlewares/authMiddleware')


const router = express.Router();

router.get('/', getAllModels)
router.get('/trending', getTrendingModels)
router.post('/like', modelLike)
router.post('/favourite', modelFavourite)
router.get('/getModelbyID', getModel)
router.get('/similar', getSimilars)

module.exports = router;