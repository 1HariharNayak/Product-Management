const { body } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Validators for adding a product
const addProductValidators = [
    body('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .custom(async (value) => {
            const product = await Product.findOne({ name: value });
            if (product) throw new Error('Product name must be unique');
            return true;
        }),
    body('description')
        .isLength({ min: 1 })
        .withMessage('Description is required'),
    body('quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    body('categories')
        .isArray({ min: 1 })
        .withMessage('At least one category is required')
        .custom(async (value) => {
            for (const id of value) {
                const category = await Category.findById(id);
                if (!category) throw new Error(`Invalid category ID: ${id}`);
            }
            return true;
        }),
];

module.exports = {
    addProductValidators,
};