const express = require('express');
const { 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    createUser, 
    getAllSubcategories, 
    updateSubCategory, 
    createSubCategory,
    getAllModels,
    updateModel,
    createCategory,
    deleteModel, 
    upload,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/categories', getAllSubcategories);
router.get('/models', getAllModels);
router.post('/user/create', createUser);
router.post('/user/update', updateUser);
router.put('/model/update', updateModel)
router.post('/subCategory/update', upload.single('image'),  updateSubCategory);
router.post('/subCategory/create', upload.single('image'), createSubCategory);
router.post('/category/create', upload.array('image'), createCategory);
router.delete('/user/delete', deleteUser);
router.delete('/model/delete', deleteModel)

module.exports = router;