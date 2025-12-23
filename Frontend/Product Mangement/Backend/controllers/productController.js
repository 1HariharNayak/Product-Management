const { validationResult } = require('express-validator');
const productService = require('../services/productService');

class ProductController {
  // Add product
  async addProduct(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await productService.addProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get products
  async getProducts(req, res) {
    try {
      const result = await productService.getProducts(req.query);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Delete product
  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.json({ message: 'Product deleted' });
    } catch (err) {
      if (err.message === 'Product not found') {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  // Get categories
  async getCategories(req, res) {
    try {
      const categories = await productService.getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new ProductController();