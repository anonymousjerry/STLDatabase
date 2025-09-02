const express = require('express')
const { likeModel, viewModel, downloadModel } = require('../controllers/modelController');
const { recaptchaMiddleware } = require('../middlewares/recaptchaMiddleware');
const { getAllModels, getTrendingModels, modelLike, modelFavourite, getModel, handleModelDownload, getSimilars, modelView, getDailyModels } = require('../controllers/modelController');

// const authenticate = require('../middlewares/authMiddleware')

const router = express.Router();

router.get('/', getAllModels)
router.post('/like', recaptchaMiddleware.like, likeModel);
router.post('/view', recaptchaMiddleware.view, viewModel);
router.post('/download', recaptchaMiddleware.download, downloadModel);
router.post('/favourite', modelFavourite)
router.get('/getModelbyID', getModel)
router.get('/similar', getSimilars)
router.get('/dailyDiscover', getDailyModels)

module.exports = router;