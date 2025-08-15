const express = require('express');
const { getAllUsers, updateUser, deleteUser, createUser, getAllSubcategories, updateSubCategory } = require('../controllers/adminController');


const router = express.Router();

router.get('/users', getAllUsers);
router.get('/categories', getAllSubcategories);
router.post('/userCreate', createUser);
router.post('/userUpdate', updateUser);
router.post('/categoryUpdate', updateSubCategory)
router.delete('/userDelete', deleteUser); 

module.exports = router;