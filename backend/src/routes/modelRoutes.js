const express = require('express')
const { getAllModels, getTrendingModels, modelLike, modelFavourite, getModel, handleModelDownload, getSimilars, modelView, getDailyModels } = require('../controllers/modelController');
// const authenticate = require('../middlewares/authMiddleware')


const router = express.Router();

router.get('/', getAllModels)
router.get('/trending', getTrendingModels)
router.post('/like', modelLike)
router.post('/favourite', modelFavourite)
router.post('/download', handleModelDownload)
router.post('/view', modelView)
router.get('/getModelbyID', getModel)
router.get('/similar', getSimilars)
router.get('/dailyDiscover', getDailyModels)

module.exports = router;