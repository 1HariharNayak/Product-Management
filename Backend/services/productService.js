const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductService {
  // Add a new product
  async addProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  // Get products with pagination, search, and filters
  async getProducts({ page = 1, limit = 10, search = '', categories = [] }) {
    const skip = (page - 1) * limit;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (categories.length > 0) query.categories = { $in: categories.split(',') };

    const products = await Product.find(query)
      .populate('categories', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { products, total, page: parseInt(page), pages };
  }

  // Delete a product by ID
  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  // Get all categories
  async getCategories() {
    return await Category.find();
  }
}

module.exports = new ProductService();