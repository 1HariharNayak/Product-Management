const express = require('express');
const productController = require('../controllers/productController');
const { addProductValidators } = require('../validators/productValidators');

const router = express.Router();

// Add product
router.post('/', addProductValidators, productController.addProduct);
// Get products with pagination, search, and category filter
router.get('/', productController.getProducts);

// Delete product
router.delete('/:id', productController.deleteProduct);

// Get categories for dropdown
router.get('/categories', productController.getCategories);

module.exports = router;