const express = require('express')
const { register, login, getUserFavourites } = require('../controllers/userController');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/getFavourites', getUserFavourites);

module.exports = router;