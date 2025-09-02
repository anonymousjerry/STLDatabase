const express = require('express')
const { getAllModels, likeModel, viewModel, downloadModel } = require('../controllers/modelController');
const { recaptchaMiddleware } = require('../middlewares/recaptchaMiddleware');
// const authenticate = require('../middlewares/authMiddleware')

const router = express.Router();

router.get('/', getAllModels)
router.post('/like', recaptchaMiddleware.like, likeModel);
router.post('/view', recaptchaMiddleware.view, viewModel);
router.post('/download', recaptchaMiddleware.download, downloadModel);

module.exports = router;